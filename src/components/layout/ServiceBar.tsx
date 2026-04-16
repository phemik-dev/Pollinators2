'use client';

/** Tri-colour service bar: Ember | Grove | Solar — AI BizHive brand signature */
export function ServiceBar() {
  return (
    <div className="flex w-full h-[9px] shrink-0">
      <span className="flex-1 bg-ember" />
      <span className="flex-1 bg-grove" />
      <span className="flex-1 bg-solar" />
    </div>
  );
}
