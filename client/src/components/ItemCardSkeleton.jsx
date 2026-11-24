import React from 'react';

export const ItemCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden animate-pulse flex flex-col h-full">
      <div className="aspect-16/10 w-full bg-slate-200" />
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded-md w-3/4" />
          <div className="h-3 bg-slate-100 rounded-md w-full" />
          <div className="h-3 bg-slate-100 rounded-md w-5/6" />
        </div>
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <div className="h-3 bg-slate-200 rounded-md w-1/3" />
            <div className="h-3 bg-slate-200 rounded-md w-1/4" />
          </div>
          <div className="h-8 bg-slate-200 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
};
export default ItemCardSkeleton;
