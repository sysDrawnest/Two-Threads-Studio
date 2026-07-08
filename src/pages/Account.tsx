import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { mockProducts } from '../data/products';
import { mockTutorials } from '../data/tutorials';
import { useAuth } from '../context/AuthContext';
import { User, History, Bookmark, BookOpen, Settings as SettingsIcon, LogOut, Award, Heart, ShoppingBag, Eye, Shield } from 'lucide-react';

const Account: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Profile" | "Orders" | "Wishlist" | "Learning" | "Settings">("Profile");
  
  // Form states
  const [firstName, setFirstName] = useState("Julia");
  const [lastName, setLastName] = useState("Hampton");
  const [email, setEmail] = useState(user?.email || "julia@example.com");
  const [isSaved, setIsSaved] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login?redirect=/account" replace />;
  }

  // Mock Data
  const savedTutorials = mockTutorials.slice(0, 2);
  const wishlistItems = mockProducts.slice(1, 4);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const getMembershipTitle = () => {
    if (user?.membershipTier === 'master') return 'Master Tier';
    if (user?.membershipTier === 'artisan') return 'Artisan Tier';
    return 'Free Tier';
  };

  const getMembershipSub = () => {
    if (user?.membershipTier === 'master') return 'Master Member';
    if (user?.membershipTier === 'artisan') return 'Artisan Member';
    return 'Community Member';
  };

  return (
    <PageContainer disablePadding={true}>
      <style>{`
        .linen-texture {
          background-color: #fef8f3;
          background-image: url("https://www.transparenttextures.com/patterns/linen-design.png");
        }
      `}</style>
      
      <div 
        className="linen-texture text-[#1d1b19] min-h-screen flex flex-col md:flex-row pt-[72px]"
      >
        
        {/* SideNavBar (Desktop Only) */}
        <aside className="fixed left-0 top-0 pt-24 pb-8 flex flex-col bg-[#f8f3ee] h-screen w-64 hidden md:flex border-r border-dashed border-[#d1c4bd] z-30">
          <div className="px-8 mb-12">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border border-[#d1c4bd]">
              <img 
                alt="User portrait" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbQfG9gz8XDCmX4Tbn_1KfgPL2wG0LKXlZpP4FWygbBz1ZtyBdYPtCC_2qY-Mvb3kVKsvmFZ5o96dzhHre_OMMnx7Zjc4xJg8E_IFqC-cINj0cfWRInaLEOcQGjY8XdsGP5q1Lezm5zp4Vip_6yMKsNRLInZ09UECSlduoXrKGqqc0eXRjQuTd8UOqjHo97P6pkkIOiT0TDcq3a4Jjhb1KvDRn7ytL31JegZlaCLMgvwK95P6fV_aLozoUJUUJjDMqmQDnk8OBLhA"
              />
            </div>
            <h2 className="font-serif text-lg font-medium text-[#17110c]">{user?.name || "Julia Hampton"}</h2>
            <p className="font-sans text-xs text-neutral-400 tracking-wider uppercase mt-0.5">{getMembershipSub()}</p>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {/* Profile Tab */}
            <button
              onClick={() => setActiveTab("Profile")}
              className={`w-full flex items-center gap-3 pl-4 py-2 font-medium font-sans text-xs tracking-widest uppercase transition-all ${
                activeTab === "Profile"
                  ? 'text-[#17110c] border-l-2 border-[#735947] bg-[#ece7e2]'
                  : 'text-neutral-500 hover:text-[#17110c] hover:bg-[#ece7e2]'
              }`}
            >
              <User size={16} />
              <span>Profile</span>
            </button>

            {/* Orders Tab */}
            <button
              onClick={() => setActiveTab("Orders")}
              className={`w-full flex items-center gap-3 pl-4 py-2 font-medium font-sans text-xs tracking-widest uppercase transition-all ${
                activeTab === "Orders"
                  ? 'text-[#17110c] border-l-2 border-[#735947] bg-[#ece7e2]'
                  : 'text-neutral-500 hover:text-[#17110c] hover:bg-[#ece7e2]'
              }`}
            >
              <History size={16} />
              <span>Orders</span>
            </button>

            {/* Wishlist Tab */}
            <button
              onClick={() => setActiveTab("Wishlist")}
              className={`w-full flex items-center gap-3 pl-4 py-2 font-medium font-sans text-xs tracking-widest uppercase transition-all ${
                activeTab === "Wishlist"
                  ? 'text-[#17110c] border-l-2 border-[#735947] bg-[#ece7e2]'
                  : 'text-neutral-500 hover:text-[#17110c] hover:bg-[#ece7e2]'
              }`}
            >
              <Bookmark size={16} />
              <span>Wishlist</span>
            </button>

            {/* Learning Tab */}
            <button
              onClick={() => setActiveTab("Learning")}
              className={`w-full flex items-center gap-3 pl-4 py-2 font-medium font-sans text-xs tracking-widest uppercase transition-all ${
                activeTab === "Learning"
                  ? 'text-[#17110c] border-l-2 border-[#735947] bg-[#ece7e2]'
                  : 'text-neutral-500 hover:text-[#17110c] hover:bg-[#ece7e2]'
              }`}
            >
              <BookOpen size={16} />
              <span>Learning</span>
            </button>
          </nav>

          <div className="px-4 mt-auto border-t border-dashed border-[#d1c4bd] pt-6 space-y-2">
            <button
              onClick={() => setActiveTab("Settings")}
              className={`w-full flex items-center gap-3 pl-4 py-2 font-medium font-sans text-xs tracking-widest uppercase transition-all ${
                activeTab === "Settings"
                  ? 'text-[#17110c] border-l-2 border-[#735947] bg-[#ece7e2]'
                  : 'text-neutral-500 hover:text-[#17110c] hover:bg-[#ece7e2]'
              }`}
            >
              <SettingsIcon size={16} />
              <span>Settings</span>
            </button>
            
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center gap-3 pl-4 py-2 font-medium font-sans text-xs tracking-widest uppercase text-neutral-500 hover:text-[#ba1a1a] transition-all hover:bg-[#ece7e2]"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-8 md:p-16 max-w-5xl mx-auto w-full pb-28 md:pb-16">
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* PROFILE TAB */}
            {activeTab === "Profile" && (
              <>
                <header className="mb-10">
                  <h1 className="font-serif text-3xl md:text-4xl font-light text-[#17110c] mb-2">Account Details</h1>
                  <div className="border-t border-dashed border-[#735947] w-full my-6 opacity-30"></div>
                </header>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-16" onSubmit={handleSave}>
                  <div className="flex flex-col space-y-2 group">
                    <label className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">First Name</label>
                    <input 
                      type="text" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-transparent border-0 border-b border-[#d1c4bd] focus:ring-0 focus:border-[#735947] transition-all py-2 font-sans text-sm text-[#17110c] placeholder:text-[#d1c4bd] focus:outline-none w-full"
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2 group">
                    <label className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-transparent border-0 border-b border-[#d1c4bd] focus:ring-0 focus:border-[#735947] transition-all py-2 font-sans text-sm text-[#17110c] placeholder:text-[#d1c4bd] focus:outline-none w-full"
                    />
                  </div>

                  <div className="flex flex-col space-y-2 md:col-span-2 group">
                    <label className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-transparent border-0 border-b border-[#d1c4bd] focus:ring-0 focus:border-[#735947] transition-all py-2 font-sans text-sm text-[#17110c] placeholder:text-[#d1c4bd] focus:outline-none w-full"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center justify-between mt-4">
                    <button 
                      type="submit"
                      className="bg-[#17110c] text-[#ffdcc5] font-sans text-[10px] tracking-[0.2em] px-10 py-4 uppercase hover:bg-[#2d2520] hover:text-[#785d4b] transition-all duration-300 shadow-sm active:scale-95 border-none"
                    >
                      Save Changes
                    </button>
                    {isSaved && (
                      <span className="text-green-600 font-sans text-xs tracking-wider animate-pulse">Changes saved successfully.</span>
                    )}
                  </div>
                </form>

                {/* Membership Block */}
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded border border-[#d1c4bd]/30 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Award size={14} className="text-[#735947]" />
                      <span className="font-sans text-[10px] tracking-[0.2em] text-[#735947] uppercase font-semibold">Membership Status</span>
                    </div>
                    <h3 className="font-serif text-xl text-[#17110c]">{getMembershipTitle()}</h3>
                    <p className="font-sans text-xs text-neutral-500 italic mt-0.5">Renews on Oct 12, 2026</p>
                  </div>
                  <Link 
                    to="/membership" 
                    className="font-sans text-xs tracking-widest uppercase text-[#735947] underline underline-offset-4 hover:text-[#17110c] transition-colors"
                  >
                    Manage Plan
                  </Link>
                </div>
              </>
            )}

            {/* ORDERS TAB */}
            {activeTab === "Orders" && (
              <>
                <header className="mb-10">
                  <h1 className="font-serif text-3xl md:text-4xl font-light text-[#17110c] mb-2">Order History</h1>
                  <div className="border-t border-dashed border-[#735947] w-full my-6 opacity-30"></div>
                </header>

                <div className="bg-white/50 backdrop-blur-sm p-12 text-center border border-[#d1c4bd]/30 rounded">
                  <ShoppingBag className="mx-auto mb-4 text-[#d1c4bd]" size={48} strokeWidth={1} />
                  <p className="font-serif text-lg text-[#17110c] mb-2">You haven't placed any orders yet.</p>
                  <p className="font-sans text-sm text-neutral-500 mb-6 max-w-sm mx-auto">When you do, their details, invoices, and shipping tracks will appear here.</p>
                  <Link 
                    to="/shop" 
                    className="inline-block bg-[#17110c] text-[#ffdcc5] px-8 py-3.5 font-sans text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors no-underline rounded-sm"
                  >
                    Start Shopping
                  </Link>
                </div>
              </>
            )}

            {/* WISHLIST TAB */}
            {activeTab === "Wishlist" && (
              <>
                <header className="mb-10">
                  <h1 className="font-serif text-3xl md:text-4xl font-light text-[#17110c] mb-2">Saved Items</h1>
                  <div className="border-t border-dashed border-[#735947] w-full my-6 opacity-30"></div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((product) => (
                    <div key={product.id} className="bg-white p-4 shadow-sm border border-neutral-100 rounded-sm group relative flex flex-col">
                      <Link to={`/shop/${product.id}`} className="block relative aspect-[4/5] overflow-hidden mb-4 bg-[#f2ede8]">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </Link>
                      <div className="flex justify-between items-start mt-auto">
                        <div>
                          <h3 className="font-serif text-base text-[#17110c] line-clamp-1">{product.name}</h3>
                          <p className="font-sans text-[10px] text-neutral-400 tracking-wider uppercase mt-0.5">{product.category}</p>
                          <p className="font-sans text-sm font-semibold text-[#17110c] mt-2">${product.price}</p>
                        </div>
                        <button className="bg-transparent border-none cursor-pointer text-[#735947] hover:text-[#17110c] transition-colors p-1" aria-label="Remove from Wishlist">
                          <Heart size={18} fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* LEARNING TAB */}
            {activeTab === "Learning" && (
              <>
                <header className="mb-10">
                  <h1 className="font-serif text-3xl md:text-4xl font-light text-[#17110c] mb-2">My Courses</h1>
                  <div className="border-t border-dashed border-[#735947] w-full my-6 opacity-30"></div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {savedTutorials.map((tutorial, idx) => (
                    <Link key={tutorial.id} to={`/learning/${tutorial.id}`} className="group block bg-white/50 backdrop-blur-sm border border-[#d1c4bd]/20 hover:border-[#d1c4bd]/40 transition-all rounded-sm overflow-hidden shadow-sm">
                      <div className="flex h-32">
                        <div className="w-1/3 h-full overflow-hidden bg-[#f2ede8]">
                          <img src={tutorial.thumbnail} alt={tutorial.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="w-2/3 p-6 flex flex-col justify-center">
                          <h3 className="font-serif text-base text-[#17110c] mb-2 line-clamp-2 leading-snug">{tutorial.title}</h3>
                          <div className="flex justify-between items-center font-sans text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                            <span>Progress</span>
                            <span>{idx === 0 ? '60%' : '15%'}</span>
                          </div>
                          <div className="h-1 w-full bg-neutral-200 overflow-hidden rounded-full">
                            <div className="h-full bg-[#735947]" style={{ width: idx === 0 ? '60%' : '15%' }} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "Settings" && (
              <>
                <header className="mb-10">
                  <h1 className="font-serif text-3xl md:text-4xl font-light text-[#17110c] mb-2">Studio Settings</h1>
                  <div className="border-t border-dashed border-[#735947] w-full my-6 opacity-30"></div>
                </header>

                <div className="bg-white/50 backdrop-blur-sm p-8 border border-[#d1c4bd]/30 rounded-sm space-y-8">
                  <div>
                    <h3 className="font-serif text-lg text-[#17110c] mb-2 flex items-center gap-2">
                      <Eye size={18} className="text-[#735947]" /> Privacy Preferences
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 mb-4">Control how your artisan profile information is visible in the Guild directory.</p>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 font-sans text-sm text-[#17110c] cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-[#735947] focus:ring-[#735947] w-4 h-4 bg-transparent" />
                        <span>Show my profile in the public Artisan Guild Directory</span>
                      </label>
                      <label className="flex items-center gap-3 font-sans text-sm text-[#17110c] cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-[#735947] focus:ring-[#735947] w-4 h-4 bg-transparent" />
                        <span>Allow members to message me regarding shared courses</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-[#d1c4bd] pt-6">
                    <h3 className="font-serif text-lg text-[#17110c] mb-2 flex items-center gap-2">
                      <Shield size={18} className="text-[#735947]" /> Notifications
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 mb-4">Choose which communications you wish to receive from the studio.</p>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 font-sans text-sm text-[#17110c] cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-[#735947] focus:ring-[#735947] w-4 h-4 bg-transparent" />
                        <span>Emails regarding order tracking, patterns updates and invoice receipts</span>
                      </label>
                      <label className="flex items-center gap-3 font-sans text-sm text-[#17110c] cursor-pointer">
                        <input type="checkbox" className="rounded border-neutral-300 text-[#735947] focus:ring-[#735947] w-4 h-4 bg-transparent" />
                        <span>Weekly newsletter digest (curated patterns and stories)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Subtle Decorative Element */}
            <div className="mt-24 text-center opacity-20">
              <Award className="text-4xl mx-auto stroke-[1.25]" />
              <p className="font-sans text-[10px] tracking-widest uppercase mt-2">Certified Artisan Quality</p>
            </div>

          </section>
        </main>

        {/* BottomNavBar (Mobile Only) */}
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-[#fef8f3]/95 backdrop-blur-lg md:hidden border-t border-dashed border-[#d1c4bd]">
          
          <button 
            onClick={() => setActiveTab("Profile")}
            className={`flex flex-col items-center justify-center font-sans text-[10px] tracking-wider uppercase bg-transparent border-none ${
              activeTab === "Profile" ? 'text-[#735947] font-semibold' : 'text-neutral-500'
            }`}
          >
            <User size={18} className={activeTab === "Profile" ? "stroke-[2]" : "stroke-[1.25]"} />
            <span className="mt-0.5">Profile</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("Orders")}
            className={`flex flex-col items-center justify-center font-sans text-[10px] tracking-wider uppercase bg-transparent border-none ${
              activeTab === "Orders" ? 'text-[#735947] font-semibold' : 'text-neutral-500'
            }`}
          >
            <History size={18} className={activeTab === "Orders" ? "stroke-[2]" : "stroke-[1.25]"} />
            <span className="mt-0.5">Orders</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("Wishlist")}
            className={`flex flex-col items-center justify-center font-sans text-[10px] tracking-wider uppercase bg-transparent border-none ${
              activeTab === "Wishlist" ? 'text-[#735947] font-semibold' : 'text-neutral-500'
            }`}
          >
            <Bookmark size={18} className={activeTab === "Wishlist" ? "stroke-[2]" : "stroke-[1.25]"} />
            <span className="mt-0.5">Saved</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("Learning")}
            className={`flex flex-col items-center justify-center font-sans text-[10px] tracking-wider uppercase bg-transparent border-none ${
              activeTab === "Learning" ? 'text-[#735947] font-semibold' : 'text-neutral-500'
            }`}
          >
            <BookOpen size={18} className={activeTab === "Learning" ? "stroke-[2]" : "stroke-[1.25]"} />
            <span className="mt-0.5">Courses</span>
          </button>

        </nav>

      </div>
    </PageContainer>
  );
};

export default Account;
