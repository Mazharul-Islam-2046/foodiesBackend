const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select("+password");
    
    if (!user || !(await user.isPasswordCorrect(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Update last login time
    await user.updateLastLogin();

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Rest of your login logic...
    
    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken
    });
  } catch (error) {
    // Error handling...
  }
} 