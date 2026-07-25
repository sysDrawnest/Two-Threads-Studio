import React from 'react';
import { useDashboardSummary } from '../../hooks/useProfile';
import LoadingSkeleton from './LoadingSkeleton';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

interface OverviewProps {
  setActiveTab?: (tab: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ setActiveTab }) => {
  const { data: summary, isLoading, error } = useDashboardSummary();

  if (isLoading) return <LoadingSkeleton />;

  if (error || !summary) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <p className="font-serif text-2xl text-[#1C1C1B] mb-4">We couldn't open your studio.</p>
        <p className="font-sans text-sm text-[#5a4a3f]">Please try refreshing the page or contact support.</p>
      </div>
    );
  }

  // Find the most recent order to feature it as the "Latest Commission"
  const latestOrder = summary.recentOrders?.[0];
  const otherOrders = summary.recentOrders?.slice(1, 3) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-24 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 pb-12">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#8c7a6b]">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-light text-[#1C1C1B]">
          {summary.customerName}
        </h1>
        <p className="font-sans text-base text-[#5a4a3f] max-w-lg mx-auto leading-loose italic">
          Welcome to your personal studio. A curated space where every handmade memory, commission, and creation lives.
        </p>
      </section>

      {/* Latest Commission */}
      {latestOrder && (
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-[#e8e3dc] pb-4">
            <h2 className="font-serif text-3xl font-light text-[#1C1C1B]">Latest Commission</h2>
            <button 
              onClick={() => setActiveTab?.('orders')}
              className="font-sans text-[10px] tracking-widest uppercase text-[#5a4a3f] hover:text-[#1C1C1B] transition-colors"
            >
              View All Orders
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12 items-start bg-white p-8 md:p-12 shadow-sm border border-neutral-100">
            <div className="w-full md:w-1/2 aspect-[4/5] bg-[#FAF9F7] overflow-hidden">
              <img 
                src={latestOrder.items[0]?.image || "https://images.unsplash.com/photo-1612423215286-9a2c3fbcc977?auto=format&fit=crop&q=80&w=800"} 
                alt="Latest Order" 
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-8 h-full pt-4 md:pt-12">
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#8c7a6b] mb-2">Order #{latestOrder.id.substring(0, 8)}</p>
                <h3 className="font-serif text-2xl text-[#1C1C1B]">{latestOrder.items[0]?.name || 'Studio Commission'}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#e8e3dc] pb-2">
                  <span className="font-sans text-xs text-[#5a4a3f]">Status</span>
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#A34A38]">{latestOrder.status}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#e8e3dc] pb-2">
                  <span className="font-sans text-xs text-[#5a4a3f]">Ordered on</span>
                  <span className="font-sans text-xs text-[#1C1C1B]">{new Date(latestOrder.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#e8e3dc] pb-2">
                  <span className="font-sans text-xs text-[#5a4a3f]">Amount</span>
                  <span className="font-sans text-xs text-[#1C1C1B]">₹{latestOrder.totalAmount?.toLocaleString('en-IN') || '0'}</span>
                </div>
              </div>

              <button className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-[#1C1C1B] border-b border-[#1C1C1B] pb-1 w-fit hover:text-[#A34A38] hover:border-[#A34A38] transition-colors mt-8">
                Track Commission <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Continue Learning */}
      <section className="bg-[#ede6de] p-12 md:p-16 text-center space-y-6">
        <BookOpen className="w-6 h-6 mx-auto text-[#A34A38] opacity-80" />
        <h2 className="font-serif text-3xl font-light text-[#1C1C1B]">Continue Learning</h2>
        <p className="font-sans text-sm text-[#5a4a3f] max-w-md mx-auto leading-relaxed">
          The art of embroidery requires patience. Resume your progress and master the French Knot.
        </p>
        <button 
          onClick={() => setActiveTab?.('learning')}
          className="inline-flex items-center gap-2 mt-4 font-sans text-xs tracking-widest uppercase text-[#A34A38] hover:text-[#1C1C1B] transition-colors"
        >
          Resume Lesson (12 mins) <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* Recommendations / Inspiration */}
      {summary.recommendedProducts && summary.recommendedProducts.length > 0 && (
        <section className="space-y-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-light text-[#1C1C1B]">Curated For You</h2>
            <p className="font-sans text-sm text-[#5a4a3f] mt-4">Selected pieces inspired by your journey.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {summary.recommendedProducts.slice(0, 3).map((product: any) => (
              <Link 
                key={product.id} 
                to={`/shop/${product.slug}`}
                className="group flex flex-col gap-4 no-underline"
              >
                <div className="aspect-[3/4] bg-[#FAF9F7] overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.imageAlt || product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-sans text-xs text-[#8c7a6b]">No Image</div>
                  )}
                </div>
                <div className="text-center">
                  <h4 className="font-serif text-lg text-[#1C1C1B] group-hover:text-[#A34A38] transition-colors">{product.name}</h4>
                  <p className="font-sans text-xs font-semibold text-[#1C1C1B] mt-2">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default Overview;
