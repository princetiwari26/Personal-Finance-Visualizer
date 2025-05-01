'use client'
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { generateToken } from '@/utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowRight, LineChart, AlertCircle } from 'lucide-react';
import Head from 'next/head';

export default function WelcomeForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const existingToken = localStorage.getItem('finance-token');
    if (!existingToken) {
      const token = generateToken();
      localStorage.setItem('finance-token', token);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // if (!name.trim()) {
    //   setError('Please enter your name');
    //   inputRef.current.focus();
    //   return;
    // }

    setIsSubmitting(true);

    try {
      localStorage.setItem('user-name', name.trim());

      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleContinueWithoutName = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>Welcome | Finance Dashboard</title>
        <meta name="description" content="Get started with your professional finance management" />
      </Head>

      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">

        <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full bg-purple-600 opacity-20 blur-[80px]"></div>
        <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] rounded-full bg-blue-600 opacity-20 blur-[80px]"></div>

        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
        />

        <div className="w-full max-w-md z-10">
          <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl overflow-hidden">
            <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full bg-purple-400/10 blur-[60px]"></div>
            <div className="absolute bottom-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-blue-400/10 blur-[60px]"></div>

            <div className="relative z-20">
              <div className="text-center">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome to<br /> <span className="text-indigo-600">Personal Finance Visualizer</span>
                  </h1>
                  <p className="text-gray-200">
                    Enter your name to access your financial dashboard
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className={`w-full pl-10 pr-2 py-2 rounded-lg bg-white/20 text-white border-2 ${error ? 'border-red-400' : 'border-blue-200 hover:border-purple-200'} outline-none focus:border-purple-800 transition-all`}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError('');
                      }}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={18} />
                  </div>
                  <AnimatePresence>
                    {error && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="mr-1" size={16} />
                        {error}
                      </p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    <span className="relative z-10 font-semibold">
                      {isSubmitting ? 'Wait...' : 'Continue'}
                    </span>
                    {!isSubmitting && <ArrowRight size={18} />}
                    {isSubmitting && (
                      <span
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: 'linear'
                        }}
                      >
                        <LineChart className="inline" size={14} />
                      </span>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center text-sm text-gray-200 pt-3 mt-5 border-t border-gray-200">
                <p>Providing your name is optional and has no effect on functionality</p>
                <button
                  onClick={handleContinueWithoutName}
                  className="mt-4 text-indigo-400 hover:underline transition underline"
                >
                  Continue without name
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
