const images = [
  "photo-1571902943202-507ec2618e8f",
  "photo-1599058917212-d750089bc07e",
  "photo-1581009146145-b5ef050c2e1e",
  "photo-1517838277536-f5f99be501cd",
  "photo-1534258936925-c58bed479fcb",
  "photo-1540497077202-7c8a3999166f"
];

export default function GalleryPage() {
  return (
    <main className="dashboard-shell">
      <section className="container">
        <span className="eyebrow">Gallery</span>
        <h1 className="section-title">Beast Force In Motion</h1>
        <div className="grid grid-3">
          {images.map((id) => <div className="gallery-tile" key={id} style={{ backgroundImage: `url(https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80)` }} />)}
        </div>
      </section>
    </main>
  );
}
