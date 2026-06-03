export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  specialty: string;
}

export interface Resource {
  title: string;
  size: string;
  type: string; // e.g., "PDF", "Image"
}

export interface TutorialModule {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
}

export interface Tutorial {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  instructorId: string;
  thumbnail: string;
  videoPlaceholder: string;
  description: string;
  modules: TutorialModule[];
  resources: Resource[];
  relatedTutorialIds: string[];
}

export const mockInstructors: Instructor[] = [
  {
    id: "inst1",
    name: "Maya Chen",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    bio: "Maya is a textile artist based in Kyoto, specializing in traditional knotting and intricate floral embroidery. She has over 15 years of experience bringing natural motifs to life on linen.",
    specialty: "Botanical & Knotting"
  },
  {
    id: "inst2",
    name: "Lena Park",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
    bio: "With a background in fine arts, Lena approaches embroidery as painting with thread. Her courses focus on color blending and the delicate satin stitch.",
    specialty: "Thread Painting"
  },
  {
    id: "inst3",
    name: "Rosa Kim",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    bio: "Rosa blends modern geometric design with slow stitching techniques. Her work is celebrated for its precise execution and calming aesthetics.",
    specialty: "Modern Geometrics"
  }
];

export const mockTutorials: Tutorial[] = [
  {
    id: "tut1",
    title: "French Knots for Beginners",
    difficulty: "Beginner",
    duration: "45 min",
    instructorId: "inst1",
    thumbnail: "https://images.unsplash.com/photo-1620783770629-122b7f187703?q=80&w=800&auto=format&fit=crop",
    videoPlaceholder: "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=1600&auto=format&fit=crop",
    description: "Master the classic French knot. In this comprehensive beginner class, Maya breaks down the mechanics of the stitch, how to vary tension, and how to use knots to create texture in floral designs.",
    modules: [
      { id: "m1", title: "Introduction to Thread Tension", duration: "05:00", completed: true },
      { id: "m2", title: "The Basic Wrap", duration: "12:30", completed: false },
      { id: "m3", title: "Securing the Stitch", duration: "08:15" },
      { id: "m4", title: "Creating Floral Textures", duration: "19:15" }
    ],
    resources: [
      { title: "French Knot Diagram Guide", size: "1.2 MB", type: "PDF" },
      { title: "Practice Pattern - Mini Bouquet", size: "2.4 MB", type: "PDF" }
    ],
    relatedTutorialIds: ["tut2", "tut3"]
  },
  {
    id: "tut2",
    title: "Satin Stitch Petals",
    difficulty: "Beginner",
    duration: "1h 15m",
    instructorId: "inst2",
    thumbnail: "https://images.unsplash.com/photo-1584446927514-633215c0e0b3?q=80&w=800&auto=format&fit=crop",
    videoPlaceholder: "https://images.unsplash.com/photo-1520699697851-3dc68aa3a474?q=80&w=1600&auto=format&fit=crop",
    description: "Learn how to fill shapes flawlessly with the satin stitch. Lena will guide you through creating smooth, even petals that look almost painted on the fabric.",
    modules: [
      { id: "m1", title: "Preparing the Fabric & Floss", duration: "10:00" },
      { id: "m2", title: "Outlining the Petal", duration: "15:00" },
      { id: "m3", title: "Filling Techniques", duration: "35:00" },
      { id: "m4", title: "Troubleshooting Gaps", duration: "15:00" }
    ],
    resources: [
      { title: "Satin Stitch Angle Guide", size: "850 KB", type: "PDF" }
    ],
    relatedTutorialIds: ["tut1", "tut4"]
  },
  {
    id: "tut3",
    title: "Geometric Grid Patterns",
    difficulty: "Intermediate",
    duration: "2h 30m",
    instructorId: "inst3",
    thumbnail: "https://images.unsplash.com/photo-1598444778129-c88c7ff4191c?q=80&w=800&auto=format&fit=crop",
    videoPlaceholder: "https://images.unsplash.com/photo-1579737151059-006f85d2eb3b?q=80&w=1600&auto=format&fit=crop",
    description: "Move beyond organic shapes and into structured design. Rosa teaches you how to map, mark, and execute precise geometric grids using backstitch and running stitch variations.",
    modules: [
      { id: "m1", title: "Transferring Precision Grids", duration: "25:00" },
      { id: "m2", title: "The Perfect Backstitch", duration: "45:00" },
      { id: "m3", title: "Interlocking Threads", duration: "50:00" },
      { id: "m4", title: "Finishing and Framing", duration: "30:00" }
    ],
    resources: [
      { title: "Printable Grid Templates", size: "3.5 MB", type: "PDF" },
      { title: "Stitch Tension Reference", size: "1.1 MB", type: "PDF" }
    ],
    relatedTutorialIds: ["tut4"]
  },
  {
    id: "tut4",
    title: "Thread Painting: Sunset Moth",
    difficulty: "Advanced",
    duration: "4h 00m",
    instructorId: "inst2",
    thumbnail: "https://images.unsplash.com/photo-1595166415582-895180f2d5e2?q=80&w=800&auto=format&fit=crop",
    videoPlaceholder: "https://images.unsplash.com/photo-1600335895229-6f755ef92cbf?q=80&w=1600&auto=format&fit=crop",
    description: "An advanced masterclass in long and short stitch blending. Lena demonstrates how to create realistic, iridescent textures mimicking a sunset moth's wings.",
    modules: [
      { id: "m1", title: "Color Theory & Selection", duration: "30:00" },
      { id: "m2", title: "Directional Guidelines", duration: "45:00" },
      { id: "m3", title: "Base Layers", duration: "60:00" },
      { id: "m4", title: "Blending Colors", duration: "75:00" },
      { id: "m5", title: "Adding Detail & Highlights", duration: "30:00" }
    ],
    resources: [
      { title: "Sunset Moth Transfer Pattern", size: "4.2 MB", type: "PDF" },
      { title: "Color Map & DMC Codes", size: "2.1 MB", type: "PDF" }
    ],
    relatedTutorialIds: ["tut2"]
  }
];
