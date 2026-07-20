import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8f7f5', padding: '40px 20px' }}>
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}
