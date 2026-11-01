import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Leaf,
  Lock,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Narasaraopet');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        city,
        role,
        password,
        password2,
      };
      const newUser = await register(payload);
      if (newUser.is_staff || newUser.profile?.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/eco-tracker', { replace: true });
      }
    } catch (err) {
      const resp = err.response?.data;
      if (resp) {
        const firstKey = Object.keys(resp)[0];
        const val = resp[firstKey];
        setErrorMsg(Array.isArray(val) ? val[0] : String(val));
      } else {
        setErrorMsg('Registration failed. Please check your network or try another username.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#f7faf8]">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-emerald-100 p-8 sm:p-10 shadow-eco space-y-6">
        
        {/* Brand & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Leaf className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-slate-500">
            Join the community sustainability movement in Narasaraopet & Lingamguntla Agraharam.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Bhavya"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Sri"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Username *</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. bhavya_sri"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 94400 00000"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">City / Town *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Narasaraopet"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Account Role *</label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`p-2.5 rounded-xl border cursor-pointer text-center font-bold transition-all ${
                  role === 'user'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === 'user'}
                  onChange={() => setRole('user')}
                  className="hidden"
                />
                🌱 Community Member
              </label>

              <label
                className={`p-2.5 rounded-xl border cursor-pointer text-center font-bold transition-all ${
                  role === 'admin'
                    ? 'bg-amber-50 border-amber-400 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="hidden"
                />
                👑 Project Administrator
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Password (min 6 chars) *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Confirm Password *</label>
              <input
                type="password"
                required
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;

