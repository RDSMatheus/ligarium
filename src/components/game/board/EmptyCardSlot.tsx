const EmptyCardSlot = () => {
  return (
    <div
      className="shrink-0 rounded-[5px] flex items-center justify-center border border-dashed border-[rgba(200,144,10,0.14)] bg-black/10"
      style={{ width: 86, height: 122 }}
    >
      <div className="w-4 h-4 rounded-full border border-[rgba(200,144,10,0.18)]" />
    </div>
  );
};

export default EmptyCardSlot;
