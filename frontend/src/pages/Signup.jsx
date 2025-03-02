import AuthForm from '../components/AuthForm';

const Signup = () => {
  return (
    <div className="min-h-screen bg-neutral-100 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <AuthForm type="signup" />
      </div>
    </div>
  );
};

export default Signup;
