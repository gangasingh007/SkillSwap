import { Request, Response } from 'express';
import User from '../models/mongo/User';
import { AuthRequest } from '../middleware/auth';

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash -refreshToken');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    const { name, bio, skillTags, avatarUrl, timezone, availabilityToggle } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skillTags) user.skillTags = skillTags;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    if (timezone) user.timezone = timezone;
    if (availabilityToggle !== undefined) user.availabilityToggle = availabilityToggle;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = await User.findById(req.params.id).select('-passwordHash -refreshToken -email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
