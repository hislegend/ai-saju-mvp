import { LoginForm } from '@/components/forms/login-form';

export const metadata = {
  title: '로그인',
};

export default function LoginPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '760px' }}>
        <LoginForm />
      </div>
    </section>
  );
}
