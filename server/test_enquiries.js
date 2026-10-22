import { app } from './server.js';
import { db } from './db.js';

// Minimal test runner using native Node fetch against the in-memory/test server
async function runTests() {
  console.log('=== STARTING SHIFTORA BACKEND INTEGRATION TESTS ===\n');

  // Start test server on dynamic or port 5001
  const server = app.listen(5099, '127.0.0.1');
  const baseUrl = 'http://127.0.0.1:5099';

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check test
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'GET /api/health returns 200 and status ok');

    // 2. Valid enquiry submission
    const validPayload = {
      customerName: 'Aarav Patel',
      originCity: 'Mumbai (Bandra)',
      destinationCity: 'Bengaluru (Koramangala)',
      serviceType: 'household-shifting',
      moveDate: '2026-11-25',
      phone: '9876543210',
      website_url: '',
    };

    const validRes = await fetch(`${baseUrl}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    });
    const validData = await validRes.json();
    assert(
      validRes.status === 201 && validData.success === true && /^SHF-\d{4}-[A-F0-9]{6}$/.test(validData.referenceCode),
      `POST /api/enquiries valid submission returns 201 and valid reference code (${validData.referenceCode})`
    );

    // 3. Database persistence check
    const dbRow = db.prepare('SELECT * FROM enquiries WHERE reference_code = ?').get(validData.referenceCode);
    assert(
      dbRow &&
        dbRow.customer_name === 'Aarav Patel' &&
        dbRow.phone === '+919876543210' &&
        dbRow.origin_city === 'Mumbai (Bandra)' &&
        dbRow.destination_city === 'Bengaluru (Koramangala)' &&
        dbRow.service_type === 'household-shifting' &&
        dbRow.move_date === '2026-11-25' &&
        dbRow.status === 'new',
      'Database persistence: record verified with normalized phone +919876543210 and exact fields'
    );

    // 4. Missing required fields
    const missingRes = await fetch(`${baseUrl}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: '', phone: '', originCity: '', destinationCity: '', serviceType: '' }),
    });
    const missingData = await missingRes.json();
    assert(
      missingRes.status === 400 &&
        missingData.errors.customerName &&
        missingData.errors.phone &&
        missingData.errors.originCity &&
        missingData.errors.destinationCity &&
        missingData.errors.serviceType,
      'Validation: correctly rejects missing required fields with 400 Bad Request'
    );

    // 5. Invalid Indian mobile number
    const badPhoneRes = await fetch(`${baseUrl}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Suresh Kumar',
        originCity: 'Delhi',
        destinationCity: 'Pune',
        serviceType: 'office-relocation',
        phone: '1234567890', // Indian mobile must start with 6,7,8,9
      }),
    });
    const badPhoneData = await badPhoneRes.json();
    assert(
      badPhoneRes.status === 400 && badPhoneData.errors.phone,
      'Validation: rejects invalid mobile prefix (not starting with 6-9)'
    );

    // 6. Invalid service type (not in allowlist)
    const badServiceRes = await fetch(`${baseUrl}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Pooja Verma',
        originCity: 'Delhi',
        destinationCity: 'Pune',
        serviceType: 'unsupported-moving-category',
        phone: '9876543210',
      }),
    });
    const badServiceData = await badServiceRes.json();
    assert(
      badServiceRes.status === 400 && badServiceData.errors.serviceType,
      'Validation: rejects service type outside explicit allowlist'
    );

    // 7. Malformed / past move date
    const pastDateRes = await fetch(`${baseUrl}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Ananya Sharma',
        originCity: 'Chennai',
        destinationCity: 'Hyderabad',
        serviceType: 'domestic-moving',
        moveDate: '2020-01-01',
        phone: '9876543210',
      }),
    });
    const pastDateData = await pastDateRes.json();
    assert(
      pastDateRes.status === 400 && pastDateData.errors.moveDate,
      'Validation: rejects past move dates'
    );

    // 8. Honeypot bot submission rejection
    const botRes = await fetch(`${baseUrl}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Spam Bot',
        originCity: 'Mumbai',
        destinationCity: 'Pune',
        serviceType: 'household-shifting',
        phone: '9876543210',
        website_url: 'http://spambot-link.com', // Honeypot filled
      }),
    });
    assert(
      botRes.status === 400,
      'Honeypot protection: bot submission with populated website_url rejected'
    );

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
  }

  console.log(`\n=== TEST RESULTS: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
