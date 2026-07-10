import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { mockProducts } from '../data/products';
import { mockTutorials } from '../data/tutorials';
import { useAuth } from '../context/AuthContext';
import { User, History, Bookmark, BookOpen, Settings as SettingsIcon, LogOut, Award, Heart, ShoppingBag, Eye, Shield, Edit, MapPin } from 'lucide-react';

const Account: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<"Profile" | "Orders" | "Wishlist" | "Learning" | "Settings" | "AddressBook">(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'orders') return 'Orders';
    if (tabParam === 'settings') return 'Settings';
    if (tabParam === 'addresses') return 'AddressBook';
    return 'Profile';
  });
  
  // Form states
  const [firstName, setFirstName] = useState("Julia");
  const [lastName, setLastName] = useState("Hampton");
  const [email, setEmail] = useState(user?.email || "julia@example.com");
  const [isSaved, setIsSaved] = useState(false);

  // Address book state
  const [addressBook, setAddressBook] = useState(() => {
    try {
      const stored = localStorage.getItem('tt_address_book');
      if (stored) return JSON.parse(stored);
      
      const defaultAddress = {
        fullName: 'Julia Hampton',
        addressLine1: '45 Artisan Boulevard',
        addressLine2: 'Apt 302',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'IN'
      };
      localStorage.setItem('tt_address_book', JSON.stringify(defaultAddress));
      return defaultAddress;
    } catch {
      return {
        fullName: '', addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', country: 'IN'
      };
    }
  });

  const [editAddress, setEditAddress] = useState({ ...addressBook });
  const [isAddressSaved, setIsAddressSaved] = useState(false);

  // Orders State
  const [orders] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('tt_orders');
      if (stored) return JSON.parse(stored);
      
      // Default mock orders for julia@example.com
      if (user?.email === 'julia@example.com' || user?.name === 'Julia Hampton') {
        const defaultOrders = [
          {
            id: 'ORD-894103',
            date: 'June 22, 2026',
            status: 'Processing',
            total: 5750,
            items: [
              {
                id: 'p1-walnut',
                productId: 'p1',
                name: 'The Meadow Walk Embroidery Kit',
                price: 5500,
                quantity: 1,
                imageUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=600&auto=format&fit=crop',
                customization: {
                  hoopFinish: 'walnut',
                  engravingText: 'J.H. 2026',
                  engravingFont: 'serif',
                  isGift: false
                }
              }
            ],
            shippingAddress: {
              fullName: 'Julia Hampton',
              addressLine1: '45 Artisan Boulevard',
              city: 'Bengaluru',
              state: 'Karnataka',
              zipCode: '560001',
              country: 'IN'
            }
          }
        ];
        localStorage.setItem('tt_orders', JSON.stringify(defaultOrders));
        return defaultOrders;
      }
      return [];
    } catch {
      return [];
    }
  });

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

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('tt_address_book', JSON.stringify(editAddress));
    setAddressBook({ ...editAddress });
    setIsAddressSaved(true);
    setTimeout(() => setIsAddressSaved(false), 3000);
  };

  const handleDownloadGuide = (productName: string) => {
    const content = `TwoThreads Studio - Digital Instruction Guide\n\nProduct: ${productName}\n\nThis guide contains detailed stitch charts, thread guide lists, and pattern instructions for your slow-craft project. Thank you for supporting TwoThreads Studio.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${productName.toLowerCase().replace(/\s+/g, '-')}-guide.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          background-color: #FBFBFA;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E");
        }
      `}</style>
      
      <div 
        className="linen-texture text-[#1C1C1B] min-h-screen flex flex-col md:flex-row pt-[72px]"
      >
        
        {/* SideNavBar (Desktop Only) */}
        <aside className="fixed left-0 top-0 pt-24 pb-8 flex flex-col bg-[#FAF9F7] h-screen w-64 hidden md:flex border-r border-neutral-200 z-30">
          <div className="px-8 mb-12">
            <div className="w-14 h-14 rounded-full overflow-hidden mb-4 border border-neutral-200">
              <img 
                alt="User portrait" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
              />
            </div>
            <h2 className="font-serif text-lg font-normal text-[#1C1C1B]">{user?.name || "Julia Hampton"}</h2>
            <p className="font-sans text-[10px] text-neutral-400 tracking-wider uppercase mt-0.5">{getMembershipSub()}</p>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {/* Profile Tab */}
            <button
              onClick={() => setActiveTab("Profile")}
              className={`w-full flex items-center gap-3 pl-4 py-3 font-medium font-sans text-[11px] tracking-widest uppercase transition-all border-none cursor-pointer bg-transparent rounded-sm ${
                activeTab === "Profile"
                  ? 'text-[#A34A38] bg-[#FAF9F7] font-semibold border-l-2 border-[#A34A38]'
                  : 'text-neutral-500 hover:text-[#1C1C1B] hover:bg-neutral-100'
              }`}
            >
              <User size={15} />
              <span>Profile</span>
            </button>

            {/* Orders Tab */}
            <button
              onClick={() => setActiveTab("Orders")}
              className={`w-full flex items-center gap-3 pl-4 py-3 font-medium font-sans text-[11px] tracking-widest uppercase transition-all border-none cursor-pointer bg-transparent rounded-sm ${
                activeTab === "Orders"
                  ? 'text-[#A34A38] bg-[#FAF9F7] font-semibold border-l-2 border-[#A34A38]'
                  : 'text-neutral-500 hover:text-[#1C1C1B] hover:bg-neutral-100'
              }`}
            >
              <History size={15} />
              <span>Orders</span>
            </button>

            {/* Address Book Tab */}
            <button
              onClick={() => setActiveTab("AddressBook")}
              className={`w-full flex items-center gap-3 pl-4 py-3 font-medium font-sans text-[11px] tracking-widest uppercase transition-all border-none cursor-pointer bg-transparent rounded-sm ${
                activeTab === "AddressBook"
                  ? 'text-[#A34A38] bg-[#FAF9F7] font-semibold border-l-2 border-[#A34A38]'
                  : 'text-neutral-500 hover:text-[#1C1C1B] hover:bg-neutral-100'
              }`}
            >
              <MapPin size={15} />
              <span>Address Book</span>
            </button>

            {/* Wishlist Tab */}
            <button
              onClick={() => setActiveTab("Wishlist")}
              className={`w-full flex items-center gap-3 pl-4 py-3 font-medium font-sans text-[11px] tracking-widest uppercase transition-all border-none cursor-pointer bg-transparent rounded-sm ${
                activeTab === "Wishlist"
                  ? 'text-[#A34A38] bg-[#FAF9F7] font-semibold border-l-2 border-[#A34A38]'
                  : 'text-neutral-500 hover:text-[#1C1C1B] hover:bg-neutral-100'
              }`}
            >
              <Bookmark size={15} />
              <span>Wishlist</span>
            </button>

            {/* Learning Tab */}
            <button
              onClick={() => setActiveTab("Learning")}
              className={`w-full flex items-center gap-3 pl-4 py-3 font-medium font-sans text-[11px] tracking-widest uppercase transition-all border-none cursor-pointer bg-transparent rounded-sm ${
                activeTab === "Learning"
                  ? 'text-[#A34A38] bg-[#FAF9F7] font-semibold border-l-2 border-[#A34A38]'
                  : 'text-neutral-500 hover:text-[#1C1C1B] hover:bg-neutral-100'
              }`}
            >
              <BookOpen size={15} />
              <span>Courses</span>
            </button>
          </nav>

          <div className="px-4 mt-auto border-t border-neutral-200 pt-6 space-y-1">
            <button
              onClick={() => setActiveTab("Settings")}
              className={`w-full flex items-center gap-3 pl-4 py-3 font-medium font-sans text-[11px] tracking-widest uppercase transition-all border-none cursor-pointer bg-transparent rounded-sm ${
                activeTab === "Settings"
                  ? 'text-[#A34A38] bg-[#FAF9F7] font-semibold border-l-2 border-[#A34A38]'
                  : 'text-neutral-500 hover:text-[#1C1C1B] hover:bg-neutral-100'
              }`}
            >
              <SettingsIcon size={15} />
              <span>Settings</span>
            </button>
            
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center gap-3 pl-4 py-3 font-medium font-sans text-[11px] tracking-widest uppercase text-neutral-400 hover:text-[#A34A38] transition-all bg-transparent border-none cursor-pointer hover:bg-neutral-100 rounded-sm"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-8 md:p-16 max-w-5xl mx-auto w-full pb-28 md:pb-16 bg-white">
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* PROFILE TAB */}
            {activeTab === "Profile" && (
              <>
                <header className="mb-10">
                  <h1 className="font-serif text-3xl font-light text-[#1C1C1B] mb-2">Account Details</h1>
                  <div className="border-b border-neutral-200 w-full my-6"></div>
                </header>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-16" onSubmit={handleSave}>
                  <div className="flex flex-col space-y-1.5">
                    <label className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">First Name</label>
                    <input 
                      type="text" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-transparent border border-neutral-200 focus:border-[#A34A38] py-2 px-3 font-sans text-sm text-[#1C1C1B] focus:outline-none w-full rounded-sm"
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <label className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-transparent border border-neutral-200 focus:border-[#A34A38] py-2 px-3 font-sans text-sm text-[#1C1C1B] focus:outline-none w-full rounded-sm"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5 md:col-span-2">
                    <label className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-transparent border border-neutral-200 focus:border-[#A34A38] py-2 px-3 font-sans text-sm text-[#1C1C1B] focus:outline-none w-full rounded-sm"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center justify-between mt-4">
                    <button 
                      type="submit"
                      className="bg-[#1C1C1B] text-[#FAF9F7] font-sans text-xs tracking-widest px-10 py-4 uppercase hover:bg-neutral-800 transition-all shadow-sm border-none rounded-sm"
                    >
                      Save Changes
                    </button>
                    {isSaved && (
                      <span className="text-green-600 font-sans text-xs tracking-wider animate-pulse">Changes saved successfully.</span>
                    )}
                  </div>
                </form>

                {/* Membership Block */}
                <div className="bg-[#FAF9F7] p-8 rounded border border-neutral-200/60 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Award size={14} className="text-[#A34A38]" />
                      <span className="font-sans text-[10px] tracking-[0.2em] text-[#A34A38] uppercase font-semibold">Membership Status</span>
                    </div>
                    <h3 className="font-serif text-xl text-[#1C1C1B]">{getMembershipTitle()}</h3>
                    <p className="font-sans text-xs text-neutral-400 italic mt-0.5">Renews on Oct 12, 2026</p>
                  </div>
                  <Link 
                    to="/membership" 
                    className="font-sans text-xs tracking-widest uppercase text-[#A34A38] underline underline-offset-4 hover:text-[#83382a] transition-colors"
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
                  <h1 className="font-serif text-3xl font-light text-[#1C1C1B] mb-2">Order History</h1>
                  <div className="border-b border-neutral-200 w-full my-6"></div>
                </header>

                {orders.length > 0 ? (
                  <div className="flex flex-col gap-8">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-neutral-200 rounded-sm overflow-hidden bg-white shadow-sm">
                        {/* Order Header */}
                        <div className="bg-[#FAF9F7] px-6 py-4 border-b border-neutral-200 flex flex-wrap justify-between items-center gap-4 text-xs font-sans text-neutral-500">
                          <div>
                            <span className="uppercase tracking-wider mr-2 font-semibold">Date Placed:</span>
                            <span className="text-[#1C1C1B]">{order.date}</span>
                          </div>
                          <div>
                            <span className="uppercase tracking-wider mr-2 font-semibold">Order ID:</span>
                            <span className="text-[#1C1C1B] font-mono">{order.id}</span>
                          </div>
                          <div>
                            <span className="uppercase tracking-wider mr-2 font-semibold">Status:</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6 flex flex-col gap-6">
                          {order.items.map((item: any, i: number) => (
                            <div key={i} className="flex flex-wrap md:flex-nowrap gap-6 items-start justify-between border-b border-neutral-100 pb-6 last:border-b-0 last:pb-0">
                              <div className="flex gap-4">
                                <div className="w-16 h-20 bg-neutral-50 border border-neutral-200 flex-shrink-0 rounded-sm overflow-hidden">
                                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <h4 className="font-serif text-base text-[#1C1C1B] leading-tight">{item.name}</h4>
                                  <p className="text-xs text-neutral-500 font-sans">Quantity: {item.quantity} • Price: ₹{item.price.toLocaleString()}</p>
                                  
                                  {/* Customizations display */}
                                  {(item.customization?.hoopFinish || item.customization?.engravingText || item.customization?.isGift) && (
                                    <div className="mt-2 p-3 bg-[#FAF9F7] border border-neutral-200/50 rounded-sm flex flex-col gap-1 text-[11px] text-neutral-500">
                                      {item.customization.hoopFinish && (
                                        <p>Hoop Option: <span className="font-medium text-[#1C1C1B] capitalize">{item.customization.hoopFinish}</span></p>
                                      )}
                                      {item.customization.engravingText && (
                                        <p>Engraving Plate: <span className="font-medium text-[#1C1C1B]">"{item.customization.engravingText}"</span> <span className="text-[9px] uppercase text-neutral-400">({item.customization.engravingFont || 'serif'})</span></p>
                                      )}
                                      {item.customization.isGift && (
                                        <p className="text-[#A34A38] font-medium">Gift Wrapper & Card Included</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <button 
                                onClick={() => handleDownloadGuide(item.name)}
                                className="bg-white text-[#A34A38] border border-[#A34A38] hover:bg-[#A34A38] hover:text-white py-2 px-4 text-[10px] uppercase tracking-widest cursor-pointer transition-colors rounded-sm font-semibold whitespace-nowrap self-start md:self-center"
                              >
                                Download Guide (PDF)
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="border-t border-neutral-100 px-6 py-4 flex justify-between items-center">
                          <span className="font-sans text-xs uppercase tracking-wider text-neutral-400">Grand Total</span>
                          <span className="font-sans text-sm font-bold text-[#1C1C1B]">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#FAF9F7] p-12 text-center border border-neutral-200/60 rounded-sm">
                    <ShoppingBag className="mx-auto mb-4 text-neutral-300" size={48} strokeWidth={1} />
                    <p className="font-serif text-lg text-[#1C1C1B] mb-2">You haven't placed any orders yet.</p>
                    <p className="font-sans text-sm text-neutral-500 mb-6 max-w-sm mx-auto">When you do, their details, invoices, and shipping tracks will appear here.</p>
                    <Link 
                      to="/shop" 
                      className="inline-block bg-[#1C1C1B] text-[#FAF9F7] px-8 py-3.5 font-sans text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors no-underline rounded-sm shadow-sm"
                    >
                      Start Shopping
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* ADDRESS BOOK TAB */}
            {activeTab === "AddressBook" && (
              <>
                <header className="mb-10">
                  <h1 className="font-serif text-3xl font-light text-[#1C1C1B] mb-2">Shipping Addresses</h1>
                  <div className="border-b border-neutral-200 w-full my-6"></div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Current Default Address Card */}
                  <div className="border border-neutral-200 rounded-sm p-6 bg-[#FAF9F7] flex flex-col justify-between">
                    <div>
                      <span className="inline-block bg-[#A34A38]/10 text-[#A34A38] text-[9px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-sm mb-4">Default Shipping Address</span>
                      <h4 className="font-serif text-lg text-[#1C1C1B] mb-2">{addressBook.fullName}</h4>
                      <p className="font-sans text-sm text-neutral-500 leading-relaxed mb-1">{addressBook.addressLine1}</p>
                      {addressBook.addressLine2 && <p className="font-sans text-sm text-neutral-500 leading-relaxed mb-1">{addressBook.addressLine2}</p>}
                      <p className="font-sans text-sm text-neutral-500 leading-relaxed">{addressBook.city}, {addressBook.state} {addressBook.zipCode}</p>
                      <p className="font-sans text-sm text-neutral-500 leading-relaxed capitalize">{addressBook.country === 'IN' ? 'India' : addressBook.country}</p>
                    </div>
                  </div>

                  {/* Edit Address Form Card */}
                  <div className="border border-neutral-200 rounded-sm p-6 bg-white">
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-4">Edit Shipping Address</h3>
                    <form onSubmit={handleSaveAddress} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[9px] uppercase tracking-wider text-neutral-400">Recipient Name</label>
                        <input 
                          type="text" 
                          value={editAddress.fullName}
                          onChange={e => setEditAddress({ ...editAddress, fullName: e.target.value })}
                          required
                          className="p-2 border border-neutral-200 text-sm font-sans focus:outline-none focus:border-[#A34A38] bg-[#FAF9F7]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[9px] uppercase tracking-wider text-neutral-400">Street Address</label>
                        <input 
                          type="text" 
                          value={editAddress.addressLine1}
                          onChange={e => setEditAddress({ ...editAddress, addressLine1: e.target.value })}
                          required
                          className="p-2 border border-neutral-200 text-sm font-sans focus:outline-none focus:border-[#A34A38] bg-[#FAF9F7]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[9px] uppercase tracking-wider text-neutral-400">Apartment / Suite (Optional)</label>
                        <input 
                          type="text" 
                          value={editAddress.addressLine2 || ''}
                          onChange={e => setEditAddress({ ...editAddress, addressLine2: e.target.value })}
                          className="p-2 border border-neutral-200 text-sm font-sans focus:outline-none focus:border-[#A34A38] bg-[#FAF9F7]"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-sans text-[9px] uppercase tracking-wider text-neutral-400">City</label>
                          <input 
                            type="text" 
                            value={editAddress.city}
                            onChange={e => setEditAddress({ ...editAddress, city: e.target.value })}
                            required
                            className="p-2 border border-neutral-200 text-sm font-sans focus:outline-none focus:border-[#A34A38] bg-[#FAF9F7]"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-sans text-[9px] uppercase tracking-wider text-neutral-400">State</label>
                          <input 
                            type="text" 
                            value={editAddress.state}
                            onChange={e => setEditAddress({ ...editAddress, state: e.target.value })}
                            required
                            className="p-2 border border-neutral-200 text-sm font-sans focus:outline-none focus:border-[#A34A38] bg-[#FAF9F7]"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-sans text-[9px] uppercase tracking-wider text-neutral-400">ZIP</label>
                          <input 
                            type="text" 
                            value={editAddress.zipCode}
                            onChange={e => setEditAddress({ ...editAddress, zipCode: e.target.value })}
                            required
                            className="p-2 border border-neutral-200 text-sm font-sans focus:outline-none focus:border-[#A34A38] bg-[#FAF9F7]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <button 
                          type="submit"
                          className="bg-[#1C1C1B] text-[#FAF9F7] py-2.5 px-6 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-neutral-800 transition-colors border-none rounded-sm font-semibold"
                        >
                          Save Address
                        </button>
                        {isAddressSaved && (
                          <span className="text-green-600 font-sans text-[11px] tracking-wide animate-pulse">Address updated</span>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </>
            )}

            {/* WISHLIST TAB */}
            {activeTab === "Wishlist" && (
              <>
                <header className="mb-10">
                  <h1 className="font-serif text-3xl font-light text-[#1C1C1B] mb-2">Saved Items</h1>
                  <div className="border-b border-neutral-200 w-full my-6"></div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((product) => (
                    <div key={product.id} className="bg-white p-4 shadow-sm border border-neutral-100 rounded-sm group relative flex flex-col">
                      <Link to={`/shop/${product.id}`} className="block relative aspect-[4/5] overflow-hidden mb-4 bg-[#FAF9F7]">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </Link>
                      <div className="flex justify-between items-start mt-auto">
                        <div>
                          <h3 className="font-serif text-base text-[#1C1C1B] line-clamp-1">{product.name}</h3>
                          <p className="font-sans text-[10px] text-neutral-400 tracking-wider uppercase mt-0.5">{product.category}</p>
                          <p className="font-sans text-sm font-semibold text-[#1C1C1B] mt-2">₹{product.price.toLocaleString()}</p>
                        </div>
                        <button className="bg-transparent border-none cursor-pointer text-[#A34A38] hover:text-[#83382a] transition-colors p-1" aria-label="Remove from Wishlist">
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
                  <h1 className="font-serif text-3xl font-light text-[#1C1C1B] mb-2">My Courses</h1>
                  <div className="border-b border-neutral-200 w-full my-6"></div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {savedTutorials.map((tutorial, idx) => (
                    <Link key={tutorial.id} to={`/learning/${tutorial.id}`} className="group block bg-[#FAF9F7] border border-neutral-200/60 hover:border-neutral-300 transition-all rounded-sm overflow-hidden shadow-sm">
                      <div className="flex h-32">
                        <div className="w-1/3 h-full overflow-hidden bg-neutral-100">
                          <img src={tutorial.thumbnail} alt={tutorial.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="w-2/3 p-6 flex flex-col justify-center">
                          <h3 className="font-serif text-base text-[#1C1C1B] mb-2 line-clamp-2 leading-snug">{tutorial.title}</h3>
                          <div className="flex justify-between items-center font-sans text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                            <span>Progress</span>
                            <span>{idx === 0 ? '60%' : '15%'}</span>
                          </div>
                          <div className="h-1 w-full bg-neutral-200 overflow-hidden rounded-full">
                            <div className="h-full bg-[#A34A38]" style={{ width: idx === 0 ? '60%' : '15%' }} />
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
                  <h1 className="font-serif text-3xl font-light text-[#1C1C1B] mb-2">Studio Settings</h1>
                  <div className="border-b border-neutral-200 w-full my-6"></div>
                </header>

                <div className="bg-[#FAF9F7] p-8 border border-neutral-200/60 rounded-sm space-y-8">
                  <div>
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-2 flex items-center gap-2">
                      <Eye size={18} className="text-[#A34A38]" /> Privacy Preferences
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 mb-4">Control how your artisan profile information is visible in the Guild directory.</p>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 font-sans text-sm text-[#1C1C1B] cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-[#A34A38] focus:ring-[#A34A38] w-4 h-4 bg-transparent" />
                        <span>Show my profile in the public Artisan Guild Directory</span>
                      </label>
                      <label className="flex items-center gap-3 font-sans text-sm text-[#1C1C1B] cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-[#A34A38] focus:ring-[#A34A38] w-4 h-4 bg-transparent" />
                        <span>Allow members to message me regarding shared courses</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-2 flex items-center gap-2">
                      <Shield size={18} className="text-[#A34A38]" /> Notifications
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 mb-4">Choose which communications you wish to receive from the studio.</p>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 font-sans text-sm text-[#1C1C1B] cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-[#A34A38] focus:ring-[#A34A38] w-4 h-4 bg-transparent" />
                        <span>Emails regarding order tracking, patterns updates and invoice receipts</span>
                      </label>
                      <label className="flex items-center gap-3 font-sans text-sm text-[#1C1C1B] cursor-pointer">
                        <input type="checkbox" className="rounded border-neutral-300 text-[#A34A38] focus:ring-[#A34A38] w-4 h-4 bg-transparent" />
                        <span>Weekly newsletter digest (curated patterns and stories)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Subtle Decorative Element */}
            <div className="mt-24 text-center opacity-25">
              <Award className="text-4xl mx-auto stroke-[1.25] text-[#A34A38]" />
              <p className="font-sans text-[10px] tracking-widest uppercase mt-2">Certified Artisan Quality</p>
            </div>

          </section>
        </main>

        {/* BottomNavBar (Mobile Only) */}
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-[#FAF9F7]/95 backdrop-blur-lg md:hidden border-t border-neutral-200">
          
          <button 
            onClick={() => setActiveTab("Profile")}
            className={`flex flex-col items-center justify-center font-sans text-[10px] tracking-wider uppercase bg-transparent border-none ${
              activeTab === "Profile" ? 'text-[#A34A38] font-semibold' : 'text-neutral-500'
            }`}
          >
            <User size={18} className={activeTab === "Profile" ? "stroke-[2]" : "stroke-[1.25]"} />
            <span className="mt-0.5">Profile</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("Orders")}
            className={`flex flex-col items-center justify-center font-sans text-[10px] tracking-wider uppercase bg-transparent border-none ${
              activeTab === "Orders" ? 'text-[#A34A38] font-semibold' : 'text-neutral-500'
            }`}
          >
            <History size={18} className={activeTab === "Orders" ? "stroke-[2]" : "stroke-[1.25]"} />
            <span className="mt-0.5">Orders</span>
          </button>

          <button 
            onClick={() => setActiveTab("AddressBook")}
            className={`flex flex-col items-center justify-center font-sans text-[10px] tracking-wider uppercase bg-transparent border-none ${
              activeTab === "AddressBook" ? 'text-[#A34A38] font-semibold' : 'text-neutral-500'
            }`}
          >
            <MapPin size={18} className={activeTab === "AddressBook" ? "stroke-[2]" : "stroke-[1.25]"} />
            <span className="mt-0.5">Addresses</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("Wishlist")}
            className={`flex flex-col items-center justify-center font-sans text-[10px] tracking-wider uppercase bg-transparent border-none ${
              activeTab === "Wishlist" ? 'text-[#A34A38] font-semibold' : 'text-neutral-500'
            }`}
          >
            <Bookmark size={18} className={activeTab === "Wishlist" ? "stroke-[2]" : "stroke-[1.25]"} />
            <span className="mt-0.5">Saved</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("Learning")}
            className={`flex flex-col items-center justify-center font-sans text-[10px] tracking-wider uppercase bg-transparent border-none ${
              activeTab === "Learning" ? 'text-[#A34A38] font-semibold' : 'text-neutral-500'
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
