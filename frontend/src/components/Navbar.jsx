import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';
import {
  Leaf,
  Menu,
  X,
  Sparkles,
  User,
  LogOut,
  LayoutDashboard,
  Award,
  Bell,
  ChevronDown,
  BookOpen,
  Users,
  Bot,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Trash2
} from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch notifications if user is logged in
  useEffect(() => {
    if (user) {
      const loadNotifications = async () => {
        try {
          const res = await notificationService.getNotifications();
          setNotifications(res.data || []);
          const unread = (res.data || []).filter((n) => !n.is_read).length;
          setUnreadCount(unread);
        } catch (err) {
          // ignore error if unauthorized or offline
        }
      };
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000); // 30s background sync
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
    setUserDropdownOpen(false);
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const markSingleRead = async (id, link) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
      setNotifOpen(false);
      if (link) navigate(link);
    } catch (err) {
      console.error(err);
    }
  };

  const primaryNav = [
    { name: 'Home', path: '/' },
    { name: 'Education & 5Rs', path: '/education' },
    { name: 'Report Waste', path: '/waste-reports' },
    { name: 'Alternatives', path: '/alternatives' },
    { name: 'Cleanups', path: '/cleanup-events' },
    { name: 'Campaigns', path: '/campaigns' },
    { name: 'Community', path: '/community' },
    { name: 'Eco AI', path: '/eco-assistant' },
    { name: 'Pledge', path: '/pledge' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-200 text-white">
              <Leaf className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-emerald-950 font-serif">
                  PLASTIC-FREE
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 tracking-wider">
                  CSP
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-700">
                Community Sustainability Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNav.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-150 ${
                  isActive(link.path)
                    ? 'bg-emerald-100/90 text-emerald-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & User Dropdown */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                
                {/* Eco Points Pill */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-full text-xs font-bold hover:shadow-xs transition-all"
                  title="View your Dashboard & Level"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{user.profile?.eco_points || 0} pts</span>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    (Lvl {user.profile?.level || 1})
                  </span>
                </Link>

                {/* Notifications Bell Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-fadeIn">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-emerald-700" />
                          <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 mt-2">
                        {notifications.length === 0 ? (
                          <p className="text-center py-6 text-xs text-slate-400">
                            No notifications yet.
                          </p>
                        ) : (
                          notifications.slice(0, 6).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => markSingleRead(item.id, item.link)}
                              className={`p-2.5 rounded-xl cursor-pointer transition-colors text-xs flex gap-2.5 items-start ${
                                item.is_read ? 'hover:bg-slate-50 opacity-75' : 'bg-emerald-50/50 hover:bg-emerald-50 font-medium'
                              }`}
                            >
                              <div className="mt-0.5 flex-shrink-0">
                                {item.notification_type === 'achievement' ? (
                                  <Award className="w-4 h-4 text-amber-500" />
                                ) : item.notification_type === 'report_status' ? (
                                  <AlertTriangle className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-slate-800">{item.title}</div>
                                <div className="text-slate-600 mt-0.5 line-clamp-2">{item.message}</div>
                                <div className="text-[10px] text-slate-400 mt-1">
                                  {new Date(item.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu Dropdown */}
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      {user.first_name ? user.first_name[0].toUpperCase() : user.username[0].toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate hidden md:inline">
                      {user.first_name || user.username}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.username}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                          {user.profile?.level_title || 'Seedling Advocate'}
                        </span>
                      </div>

                      <div className="py-1 text-xs">
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                          <span>User Dashboard</span>
                        </Link>
                        <Link
                          to="/eco-tracker"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-medium"
                        >
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Eco Activities Tracker</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-medium"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          <span>Profile & Badges</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin-dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-amber-800 bg-amber-50/60 hover:bg-amber-100 font-bold"
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-600" />
                            <span>Admin Console</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/pledge"
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Take Pledge</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {user && (
              <Link
                to="/dashboard"
                className="flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full text-xs font-bold"
              >
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{user.profile?.eco_points || 0}</span>
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-emerald-100 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {primaryNav.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                  isActive(link.path)
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'text-slate-700 hover:bg-emerald-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 w-full px-4 py-2.5 bg-amber-500 text-white font-bold rounded-xl text-xs"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Console</span>
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold rounded-xl text-xs"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>My Dashboard ({user.profile?.eco_points || 0} pts)</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg text-xs"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile ({user.username})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 font-semibold rounded-lg text-xs text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 bg-slate-100 text-slate-800 font-bold rounded-xl text-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/pledge"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow"
                >
                  Take Plastic-Free Pledge
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
