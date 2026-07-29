import React, { useState, useEffect } from 'react';
import { X, Star, Upload, Trash2, Video, AlertCircle } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage?: string;
  initialReview?: any;
  onSubmitSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  initialReview,
  onSubmitSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  
  // Custom Attributes
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [packagingRating, setPackagingRating] = useState<number>(5);
  const [valueRating, setValueRating] = useState<number>(5);
  const [easeOfUseRating, setEaseOfUseRating] = useState<number>(5);
  const [wouldRecommend, setWouldRecommend] = useState<boolean>(true);

  // Media
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating || 5);
      setTitle(initialReview.title || '');
      setComment(initialReview.comment || '');
      setQualityRating(initialReview.qualityRating || 5);
      setPackagingRating(initialReview.packagingRating || 5);
      setValueRating(initialReview.valueRating || 5);
      setEaseOfUseRating(initialReview.easeOfUseRating || 5);
      setWouldRecommend(initialReview.wouldRecommend !== false);
      setImages(initialReview.media?.filter((m: any) => m.type === 'IMAGE').map((m: any) => m.url) || []);
      setVideoUrl(initialReview.media?.find((m: any) => m.type === 'VIDEO')?.url || '');
    } else {
      setRating(5);
      setTitle('');
      setComment('');
      setQualityRating(5);
      setPackagingRating(5);
      setValueRating(5);
      setEaseOfUseRating(5);
      setWouldRecommend(true);
      setImages([]);
      setVideoUrl('');
    }
  }, [initialReview, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error('You can upload a maximum of 5 images');
      return;
    }

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await adminService.uploadImage(file);
        if (res.success && res.data?.url) {
          uploadedUrls.push(res.data.url);
        }
      }

      setImages(prev => [...prev, ...uploadedUrls]);
      toast.success('Images uploaded successfully');
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || comment.trim().length < 10) {
      toast.error('Please write a detailed review (minimum 10 characters)');
      return;
    }

    try {
      setSubmitting(true);
      await reviewService.submitReview({
        productId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        qualityRating,
        packagingRating,
        valueRating,
        easeOfUseRating,
        wouldRecommend,
        images,
        videoUrl: videoUrl.trim() || undefined,
      });

      toast.success(initialReview ? 'Review updated successfully' : 'Review submitted for moderation');
      if (onSubmitSuccess) onSubmitSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-background rounded-2xl border border-outline-variant shadow-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4 bg-surface-container/30">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-primary-container">
              {initialReview ? 'Edit Product Review' : 'Write a Review'}
            </h3>
            <p className="text-xs text-on-secondary-container mt-0.5 max-w-[450px] truncate">
              For: {productName}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-surface-container text-on-secondary-container transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex gap-4 items-center">
            {productImage && (
              <img src={productImage} alt={productName} className="h-16 w-16 object-cover rounded-lg border border-outline-variant flex-shrink-0" />
            )}
            <div>
              <span className="text-sm font-medium text-primary-container block mb-1">Overall Rating</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5 text-2xl transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= (hoverRating || rating)
                          ? 'fill-[#f57f17] text-[#f57f17]'
                          : 'text-outline-variant'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Attributes Ratings */}
          <div className="bg-surface-container/20 p-4 rounded-xl space-y-4 border border-outline-variant">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-primary-container">Attribute Ratings</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Quality */}
              <div>
                <span className="text-xs text-on-secondary-container block mb-1 font-medium">Product Quality</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setQualityRating(val)}
                      className="p-0.5"
                    >
                      <Star className={`h-4 w-4 ${val <= qualityRating ? 'fill-[#f57f17] text-[#f57f17]' : 'text-outline-variant'}`} />
                    </button>
                  ))}
                </div>
              </div>
              {/* Packaging */}
              <div>
                <span className="text-xs text-on-secondary-container block mb-1 font-medium">Packaging Quality</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPackagingRating(val)}
                      className="p-0.5"
                    >
                      <Star className={`h-4 w-4 ${val <= packagingRating ? 'fill-[#f57f17] text-[#f57f17]' : 'text-outline-variant'}`} />
                    </button>
                  ))}
                </div>
              </div>
              {/* Value for Money */}
              <div>
                <span className="text-xs text-on-secondary-container block mb-1 font-medium">Value for Money</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setValueRating(val)}
                      className="p-0.5"
                    >
                      <Star className={`h-4 w-4 ${val <= valueRating ? 'fill-[#f57f17] text-[#f57f17]' : 'text-outline-variant'}`} />
                    </button>
                  ))}
                </div>
              </div>
              {/* Ease of Use */}
              <div>
                <span className="text-xs text-on-secondary-container block mb-1 font-medium">Easy to Learn / Use</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setEaseOfUseRating(val)}
                      className="p-0.5"
                    >
                      <Star className={`h-4 w-4 ${val <= easeOfUseRating ? 'fill-[#f57f17] text-[#f57f17]' : 'text-outline-variant'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation Toggle */}
            <div className="border-t border-outline-variant pt-3 flex items-center justify-between">
              <span className="text-xs text-on-secondary-container font-medium">Would you recommend this to a friend?</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setWouldRecommend(true)}
                  className={`px-3 py-1 text-xs rounded-md font-medium border transition-colors ${
                    wouldRecommend 
                      ? 'bg-primary-container text-background border-primary-container'
                      : 'border-outline-variant text-primary-container hover:bg-surface-container'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setWouldRecommend(false)}
                  className={`px-3 py-1 text-xs rounded-md font-medium border transition-colors ${
                    !wouldRecommend 
                      ? 'bg-[#c5221f] text-background border-[#c5221f]'
                      : 'border-outline-variant text-primary-container hover:bg-surface-container'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Title & Comment */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-primary-container mb-1">Review Title (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Beautiful pattern, very beginner friendly!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-background text-primary-container focus:outline-none focus:border-primary-container transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-primary-container mb-1">Detailed Review</label>
              <textarea
                rows={4}
                required
                placeholder="Share your experience making this kit. What did you like or dislike? Was there enough thread included?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-background text-primary-container focus:outline-none focus:border-primary-container transition-colors text-sm resize-none"
              />
              <span className="text-xs text-on-secondary-container block text-right mt-1">
                Minimum 10 characters.
              </span>
            </div>
          </div>

          {/* Image Upload Dropzone */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wider font-semibold text-primary-container">Add Photos (Max 5)</label>
            <div className="grid grid-cols-5 gap-2">
              {images.map((imgUrl, index) => (
                <div key={index} className="relative aspect-square border border-outline-variant rounded-lg overflow-hidden group">
                  <img src={imgUrl} alt="Review attachment preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-white hover:text-red-400 transition-colors" />
                  </button>
                </div>
              ))}
              
              {images.length < 5 && (
                <label className="border border-dashed border-outline-variant rounded-lg flex flex-col items-center justify-center cursor-pointer aspect-square hover:bg-surface-container/10 transition-colors text-on-secondary-container hover:text-primary-container">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploading ? (
                    <span className="text-[10px] font-medium">Uploading...</span>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mb-1" />
                      <span className="text-[10px] font-medium text-center">Add Photo</span>
                    </>
                  )}
                </label>
              )}
            </div>
          </div>

          {/* Video Link */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-primary-container mb-1">Add Video Link (Optional)</label>
            <div className="relative">
              <input
                type="url"
                placeholder="e.g. YouTube, Instagram Reel, or TikTok video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-background text-primary-container focus:outline-none focus:border-primary-container transition-colors text-sm"
              />
              <Video className="absolute left-3 top-2.5 h-4 w-4 text-on-secondary-container" />
            </div>
          </div>

          {/* Moderation Note */}
          <div className="bg-[#fff9c4] p-3 rounded-lg border border-[#fff59d] flex gap-2 items-start text-xs text-[#f57f17]">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              To maintain our quality standards, all reviews are moderated for profanity, duplicate content, and spam. Once reviewed, your story will be published.
            </p>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="border-t border-outline-variant px-6 py-4 bg-surface-container/30 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-outline-variant rounded-md font-medium text-primary-container hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting || uploading}
            className="px-5 py-2 text-sm bg-primary-container text-background font-medium rounded-md hover:bg-primary-container/90 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : (initialReview ? 'Save Changes' : 'Submit Review')}
          </button>
        </div>
      </div>
    </div>
  );
};
