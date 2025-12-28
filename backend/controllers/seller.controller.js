
import Company from '../models/seller.model.js';
import User from '../models/user.mode


export const upsertCompany = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      companyName,
      businessType,
      description,
      gstNumber,
      subdomain,
      address,
      establishedYear,
      website,
      logo,
    } = req.body;

    if (
      !companyName ||
      !businessType ||
      !subdomain ||
      !address?.city ||
      !address?.state
    ) {
      return res.status(400).json({
        message:
          "Company name, business type, subdomain and address are required",
      });
    }

    const normalizedSubdomain = subdomain
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    // Check subdomain uniqueness
    const existingSubdomain = await Company.findOne({
      subdomain: normalizedSubdomain,
      owner: { $ne: userId }, 
    });

    if (existingSubdomain) {
      return res.status(409).json({
        message: "Subdomain already taken. Choose another one.",
      });
    }
      await User.findByIdAndUpdate(userId, {
      role: "seller",
      isSeller: true,
      isOnboardingCompleted: true,
    });


    // Upsert company
    const company = await Company.findOneAndUpdate(
      { owner: userId },
      {
        owner: userId,
        companyName,
        businessType,
        description,
        gstNumber,
        subdomain: normalizedSubdomain,
        address,
        establishedYear,
        website,
        logo,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Company details saved successfully",
      company,
    });
  } catch (err) {
    console.error("COMPANY UPSERT ERROR:", err);

    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Subdomain already exists",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};


/**
 * GET LOGGED-IN SELLER COMPANY
 * GET /api/v1/company/me
 */
export const getMyCompany = async (req, res) => {
  try {
    const userId = req.user.id;

    const company = await Company.findOne({ owner: userId }).populate(
      "owner",
      "name email role"
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // ✅ FIX: wrap company
    res.status(200).json({
      company,
    });
  } catch (err) {
    console.error("GET COMPANY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✏️ UPDATE COMPANY DETAILS
 * PUT /api/v1/company/me
 */
export const updateCompany = async (req, res) => {
  try {
    const userId = req.user.id;

    const company = await Company.findOneAndUpdate(
      { owner: userId },
      req.body,
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({
      message: 'Company updated successfully',
      company,
    });
  } catch (err) {
    console.error('UPDATE COMPANY ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
