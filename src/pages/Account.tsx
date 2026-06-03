import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Link } from 'react-router-dom';
import { mockProducts } from '../data/products';
import { mockTutorials } from '../data/tutorials';

const Account: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Profile" | "Orders" | "Wishlist" | "Learning">("Profile");

  // Mock Data
  const savedTutorials = mockTutorials.slice(0, 2);
  const wishlistItems = mockProducts.slice(1, 4);

  return (
    <PageContainer>
      <div className="bg-background min-h-[80vh] flex flex-col md:flex-row">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 lg:w-80 border-b md:border-b-0 md:border-r border-outline-variant p-6 md:p-12">
          <div className="mb-10">
            <h1 className="font-serif text-3xl text-primary-container mb-2">My Studio</h1>
            <p className="font-sans text-xs uppercase tracking-widest text-on-surface-variant">Master Member</p>
          </div>
          
          <nav className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
            {(["Profile", "Orders", "Wishlist", "Learning"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left font-sans text-sm tracking-widest uppercase transition-colors whitespace-nowrap px-4 py-2 md:p-0 rounded-full md:rounded-none ${
                  activeTab === tab 
                    ? 'text-primary-container font-semibold bg-surface-variant md:bg-transparent' 
                    : 'text-on-surface-variant hover:text-primary-container bg-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
            <button className="text-left font-sans text-sm tracking-widest uppercase text-on-surface-variant hover:text-[#8b0000] transition-colors whitespace-nowrap px-4 py-2 md:p-0 bg-transparent md:mt-12">
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-12 lg:p-24 bg-inverse-on-surface">
          
          {/* Profile Tab */}
          {activeTab === "Profile" && (
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl font-light text-primary-container mb-8">Account Details</h2>
              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <label className="block font-sans text-xs uppercase tracking-widest text-primary-container mb-2">First Name</label>
                    <input type="text" defaultValue="Julia" className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary-container font-sans text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="block font-sans text-xs uppercase tracking-widest text-primary-container mb-2">Last Name</label>
                    <input type="text" defaultValue="Hampton" className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary-container font-sans text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-primary-container mb-2">Email Address</label>
                  <input type="email" defaultValue="julia@example.com" className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary-container font-sans text-sm" />
                </div>
                
                <div className="mt-8 pt-8 border-t border-outline-variant">
                  <h3 className="font-serif text-xl text-primary-container mb-4">Membership Management</h3>
                  <div className="bg-white p-6 shadow-sm border border-outline-variant/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="font-sans text-sm font-semibold text-primary-container">Master Tier</p>
                      <p className="font-sans text-xs text-on-surface-variant">Renews on Oct 12, 2026</p>
                    </div>
                    <Link to="/membership" className="font-sans text-xs uppercase tracking-widest text-on-secondary-container underline">Manage Plan</Link>
                  </div>
                </div>

                <button type="submit" className="self-start mt-8 bg-primary-container text-inverse-on-surface px-9 py-4 font-sans text-sm tracking-[0.15em] uppercase cursor-pointer hover:bg-[#5a3d2b] transition-colors border-none">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "Orders" && (
            <div>
              <h2 className="font-serif text-3xl font-light text-primary-container mb-8">Order History</h2>
              <div className="bg-white p-12 text-center shadow-sm border border-outline-variant/50">
                <svg className="mx-auto mb-4" width="48" height="48" fill="none" stroke="#d4c4b5" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <p className="font-sans text-base text-primary-container mb-2">You haven't placed any orders yet.</p>
                <p className="font-sans text-sm text-on-surface-variant mb-6">When you do, their details and tracking info will appear here.</p>
                <Link to="/shop" className="inline-block bg-transparent text-primary-container border border-primary-container px-6 py-3 font-sans text-sm tracking-[0.15em] uppercase hover:bg-primary-container hover:text-inverse-on-surface transition-colors no-underline">
                  Start Shopping
                </Link>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "Wishlist" && (
            <div>
              <h2 className="font-serif text-3xl font-light text-primary-container mb-8">Saved Items</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((product) => (
                  <div key={product.id} className="bg-white p-4 shadow-sm group">
                    <Link to={`/shop/${product.id}`} className="block relative aspect-square overflow-hidden mb-4 bg-surface-container">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </Link>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-lg text-primary-container line-clamp-1">{product.name}</h3>
                        <p className="font-sans text-sm text-[#5a4a3f]">${product.price}</p>
                      </div>
                      <button className="bg-transparent border-none cursor-pointer text-on-surface-variant hover:text-primary-container transition-colors p-1" aria-label="Remove from Wishlist">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Tab */}
          {activeTab === "Learning" && (
            <div>
              <h2 className="font-serif text-3xl font-light text-primary-container mb-8">My Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {savedTutorials.map((tutorial, idx) => (
                  <Link key={tutorial.id} to={`/learning/${tutorial.id}`} className="group block bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex h-32">
                      <div className="w-1/3 h-full overflow-hidden bg-surface-container">
                        <img src={tutorial.thumbnail} alt={tutorial.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <div className="w-2/3 p-6 flex flex-col justify-center">
                        <h3 className="font-serif text-lg text-primary-container mb-2 line-clamp-1">{tutorial.title}</h3>
                        <div className="flex justify-between items-center font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
                          <span>Progress</span>
                          <span>{idx === 0 ? '60%' : '15%'}</span>
                        </div>
                        <div className="h-1 w-full bg-outline-variant/50 overflow-hidden">
                          <div className="h-full bg-on-secondary-container" style={{ width: idx === 0 ? '60%' : '15%' }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </PageContainer>
  );
};

export default Account;
