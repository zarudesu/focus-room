import type { MovementSnack } from '../types';

export const MOVEMENT_SNACKS: MovementSnack[] = [
  { id: 'reach-up', title: 'Reach for the ceiling', instruction: 'Stand up, stretch both arms straight up, hold.', seconds: 60 },
  { id: 'window-walk', title: 'Walk to the window and back', instruction: 'Just there and back, no rush.', seconds: 90 },
  { id: 'shoulder-rolls', title: 'Shoulder rolls', instruction: 'Slow rolls, forward then back.', seconds: 60 },
  { id: 'shake-out', title: 'Shake out your hands and arms', instruction: 'Let them go loose, like drying them off.', seconds: 60 },
  { id: 'march', title: 'March in place', instruction: 'Knees up, easy pace.', seconds: 90 },
  { id: 'neck-stretch', title: 'Stretch your neck', instruction: 'Slow tilts, side to side.', seconds: 60 },
  { id: 'squats', title: 'Bodyweight squats', instruction: 'As many as feels right, no count to hit.', seconds: 90 },
  { id: 'ankle-rolls', title: 'Roll your ankles', instruction: 'One foot at a time, both directions.', seconds: 60 },
  { id: 'kitchen-walk', title: 'Walk to the kitchen and back', instruction: 'Water is a good excuse.', seconds: 120 },
  { id: 'overhead-stretch', title: 'Arms overhead, hold', instruction: 'Interlace fingers, palms up, breathe.', seconds: 60 },
  { id: 'fresh-air', title: 'Step outside for a moment', instruction: 'Doorway, balcony, whatever counts as outside.', seconds: 180 },
  { id: 'torso-twist', title: 'Gentle torso twist', instruction: 'Feet planted, rotate slowly side to side.', seconds: 60 },
];
