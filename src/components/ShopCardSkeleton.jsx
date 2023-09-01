const ShopCardSkeleton = () => (
  <div className="px-1 col-sm-6 col-12">
    <div className="card rounded-4 px-5 pt-4 pb-3 d-flex flex-column w-100">
      <div>
        <div className="skeleton" style={{ width: "35%", height: "1rem" }} />
        <div className="skeleton" style={{ width: "65%", height: "0.7rem" }} />
        <div className="skeleton" style={{ width: "45%", height: "0.7rem" }} />
        <div className="skeleton" style={{ width: "40%", height: "0.7rem" }} />
      </div>
      <div className="skeleton" style={{ width: "20%", height: "0.7rem", alignSelf: "end" }} />
    </div>
  </div>
);

export default ShopCardSkeleton;
