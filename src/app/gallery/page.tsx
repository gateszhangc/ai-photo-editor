import { Button } from "@/components/ui/button";

export default function GalleryPage() {
  // Mock data for demonstration
  const sampleImages = [
    { id: 1, title: "Enhanced Portrait", type: "Portrait", size: "2.1MB" },
    { id: 2, title: "Landscape Beauty", type: "Landscape", size: "3.4MB" },
    { id: 3, title: "Night Scene", type: "Night", size: "1.8MB" },
    { id: 4, title: "Artistic Style", type: "Artistic", size: "2.7MB" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gallery</h1>
        <p className="text-gray-600">
          Browse your edited photos and download them anytime
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleImages.map((image) => (
          <div key={image.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                  📷
                </div>
                <p className="text-sm">Sample Image</p>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold mb-1">{image.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {image.type} • {image.size}
              </p>
              
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  Download
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sampleImages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">📷</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
          <p className="text-gray-600 mb-4">
            Start editing photos to see them in your gallery
          </p>
          <Button>
            Go to Editor
          </Button>
        </div>
      )}
    </div>
  );
}