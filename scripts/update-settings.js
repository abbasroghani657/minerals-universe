const fs = require('fs');
let code = fs.readFileSync('app/admin/settings/page.tsx', 'utf8');

// 1. Remove bank fields from state
const bankFields = [
  "    bankName: '',",
  "    accountTitle: '',",
  "    accountNumber: '',",
  "    iban: '',",
  "    raastId: '',",
  "    easyPaisaNumber: '',",
  "    jazzCashNumber: '',",
  "    paymentInstructions: '',"
].join('\n') + '\n';

code = code.replace(bankFields, '');

// 2. Remove bank fallbacks in loadSettings
const fallbacks = [
  "            bankName: data.settings.bankName || 'Meezan Bank Limited',",
  "            accountTitle: data.settings.accountTitle || 'Zaheer Abbas / Minerals Universe',"
].join('\n') + '\n';

code = code.replace(fallbacks, '');

// 3. Remove header subtitle text
code = code.replace(
  'Pakistani bank details, and social channels.',
  'brand identity, and social channels.'
);

// 4. Remove Section 1
const sec1Start = code.indexOf('{/* SECTION 1: Pakistani Bank & Direct Payment Accounts */}');
const sec2Start = code.indexOf('{/* SECTION 2: Social Networks & Contacts */}');

if (sec1Start !== -1 && sec2Start !== -1) {
  code = code.slice(0, sec1Start) + code.slice(sec2Start);
  console.log('Successfully removed Section 1!');
} else {
  console.error('Could not find Section 1 markers!');
}

fs.writeFileSync('app/admin/settings/page.tsx', code, 'utf8');
console.log('Settings page successfully updated!');
