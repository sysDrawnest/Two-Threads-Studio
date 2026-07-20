export type DecorationVariant = 
  | 'wave-01' | 'wave-02' | 'wave-long'
  | 'needle' | 'needle-gold'
  | 'embroidery-knot' | 'stitched-arrow'
  | 'cross-stitch-border'
  | 'leaf-thread' | 'flower-thread' | 'vine-thread'
  | 'frame-top' | 'frame-bottom' | 'frame-left' | 'frame-right'
  | 'divider-knot' | 'divider-stitch';

export interface PathItem {
  d: string;
  filled?: boolean;
  strokeWidth?: number;
}

export interface DecorationData {
  viewBox: string;
  paths: PathItem[];
}

export const DECORATION_PATHS: Record<DecorationVariant, DecorationData> = {
  'wave-01': {
    viewBox: '0 0 400 100',
    paths: [{ d: 'M 0,50 Q 50,22 100,52 T 200,48 T 300,53 T 400,47' }]
  },
  'wave-02': {
    viewBox: '0 0 400 100',
    paths: [{ d: 'M 0,80 C 80,85 140,15 200,50 C 260,85 320,15 400,20' }]
  },
  'wave-long': {
    viewBox: '0 0 800 200',
    paths: [{ d: 'M -50,150 C 200,250 400,-50 850,100' }]
  },
  'needle': {
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M 10,90 L 85,15 C 88,12 90,10 90,10 C 92,12 92,15 90,18 L 15,95 Z' },
      { d: 'M 82,18 L 86,14', strokeWidth: 1 }
    ]
  },
  'needle-gold': {
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M 5,95 L 90,10 A 2,2 0 0,1 95,15 L 10,100 Z', filled: true },
      { d: 'M 85,15 L 90,20', strokeWidth: 1.5 }
    ]
  },
  'embroidery-knot': {
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M 20,50 C 40,50 45,30 50,40 C 55,50 45,60 40,50 C 35,40 50,45 60,50 C 70,55 80,50 90,50' }
    ]
  },
  'stitched-arrow': {
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M 10,50 Q 45,48 90,50' },
      { d: 'M 70,35 Q 82,45 90,50 Q 82,55 70,65' }
    ]
  },
  'cross-stitch-border': {
    viewBox: '0 0 400 40',
    paths: [
      { d: 'M 10,10 L 30,30 M 30,10 L 10,30 M 50,10 L 70,30 M 70,10 L 50,30 M 90,10 L 110,30 M 110,10 L 90,30 M 130,10 L 150,30 M 150,10 L 130,30 M 170,10 L 190,30 M 190,10 L 170,30 M 210,10 L 230,30 M 230,10 L 210,30 M 250,10 L 270,30 M 270,10 L 250,30 M 290,10 L 310,30 M 310,10 L 290,30 M 330,10 L 350,30 M 350,10 L 330,30 M 370,10 L 390,30 M 390,10 L 370,30' }
    ]
  },
  'leaf-thread': {
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M 10,90 Q 50,70 90,10 C 70,20 40,30 10,90 Z' },
      { d: 'M 10,90 Q 60,60 90,10' }
    ]
  },
  'flower-thread': {
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M 50,50 C 30,20 70,20 50,50 C 80,30 80,70 50,50 C 70,80 30,80 50,50 C 20,70 20,30 50,50' },
      { d: 'M 50,50 L 50,90' },
      { d: 'M 50,70 Q 70,60 80,40' }
    ]
  },
  'vine-thread': {
    viewBox: '0 0 100 200',
    paths: [
      { d: 'M 50,200 Q 30,150 60,100 T 40,0' },
      { d: 'M 45,150 Q 20,140 10,120' },
      { d: 'M 60,100 Q 80,90 90,70' },
      { d: 'M 50,40 Q 20,30 15,10' }
    ]
  },
  'frame-top': {
    viewBox: '0 0 400 50',
    paths: [
      { d: 'M 20,40 C 20,20 40,20 60,20 L 340,20 C 360,20 380,20 380,40' }
    ]
  },
  'frame-bottom': {
    viewBox: '0 0 400 50',
    paths: [
      { d: 'M 20,10 C 20,30 40,30 60,30 L 340,30 C 360,30 380,30 380,10' }
    ]
  },
  'frame-left': {
    viewBox: '0 0 50 400',
    paths: [
      { d: 'M 40,20 C 20,20 20,40 20,60 L 20,340 C 20,360 20,380 40,380' }
    ]
  },
  'frame-right': {
    viewBox: '0 0 50 400',
    paths: [
      { d: 'M 10,20 C 30,20 30,40 30,60 L 30,340 C 30,360 30,380 10,380' }
    ]
  },
  'divider-knot': {
    viewBox: '0 0 400 40',
    paths: [
      { d: 'M 0,20 L 190,20 C 195,20 200,15 205,20 C 210,25 195,25 200,20 C 205,15 210,20 220,20 L 400,20' }
    ]
  },
  'divider-stitch': {
    viewBox: '0 0 400 40',
    paths: [
      { d: 'M 0,20 L 40,20 M 60,20 L 140,20 M 160,20 L 240,20 M 260,20 L 340,20 M 360,20 L 400,20' }
    ]
  },
};
