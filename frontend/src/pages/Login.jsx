import AuthForm from '../components/AuthForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-neutral-100 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <AuthForm type="login" />
      </div>
    </div>
  );
};

export default Login;
