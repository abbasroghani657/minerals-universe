import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8f7f5', padding: '40px 20px' }}>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}
