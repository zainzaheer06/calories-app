# ⚙️ Settings Feature Added

## ✅ New Settings Page Created

A complete settings page has been added where users can edit their profile information and goals.

## 🎯 Features

### Personal Information
- **Name** - Edit user name
- **Age** - Update age
- **Gender** - Select Male/Female/Other

### Physical Stats
- **Weight (kg)** - Update current weight
- **Height (cm)** - Update height

### Goals & Activity
- **Activity Level** - Choose from:
  - Sedentary (little or no exercise)
  - Lightly Active (1-3 days/week)
  - Moderately Active (3-5 days/week)
  - Very Active (6-7 days/week)
  - Extra Active (athlete)

- **Goal Type** - Select:
  - Lose Weight
  - Maintain Weight
  - Gain Weight

- **Daily Calorie Goal** - Set custom calorie target
  - Auto-calculated if left empty based on stats

## 📱 How to Access

### From Profile Screen:
1. Tap **Profile** tab (👤) in bottom navigation
2. Tap **⚙️ Edit Profile & Goals** button
3. Edit your information
4. Tap **Save Changes**

## 🔧 Backend Integration

### Existing Backend Routes Used:
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/profile` - Get current profile

### Data Sent to Backend:
```javascript
{
  name: "User Name",
  age: 25,
  weight: 70,
  height: 175,
  gender: "male",
  activity_level: "moderate",
  goal_type: "maintain",
  daily_calorie_goal: 2000
}
```

## 🎨 UI Design

### Layout:
- **Header** - Green background with title
- **Sections** - White cards with shadows
  - Personal Information
  - Physical Stats
  - Goals & Activity
- **Save Button** - Green button at bottom
- **Info Card** - Blue tip card with helpful information

### Form Elements:
- Text inputs for name, age, weight, height, calorie goal
- Dropdown pickers for gender, activity level, goal type
- Loading indicator while saving
- Success/error alerts

## 📋 Files Created/Modified

### New Files:
1. **CalorieMobileApp/src/screens/SettingsScreen.js**
   - Complete settings form
   - Form validation
   - API integration
   - Loading states
   - Success/error handling

### Modified Files:
1. **CalorieMobileApp/src/screens/ProfileScreen.js**
   - Added "Edit Profile & Goals" button
   - Navigation to Settings screen
   - Updated styling

2. **CalorieMobileApp/App.js**
   - Added SettingsScreen import
   - Added Settings route to MainStack
   - Navigation configured

3. **CalorieMobileApp/src/context/AuthContext.js**
   - Already has `updateUser` function
   - Updates user state after profile changes

## 🔄 User Flow

```
Profile Screen
     ↓
[Tap "Edit Profile & Goals"]
     ↓
Settings Screen
     ↓
[Edit Information]
     ↓
[Tap "Save Changes"]
     ↓
API Call to Backend
     ↓
Update User Context
     ↓
Show Success Alert
     ↓
Return to Profile
```

## ✨ Features Included

✅ Edit all profile fields
✅ Dropdown selectors for enums
✅ Form validation
✅ Loading states
✅ Success/error alerts
✅ Auto-calculate calorie goal
✅ Helpful tips
✅ Clean, professional UI
✅ Proper navigation
✅ Context updates
✅ Backend integration

## 💡 Smart Features

### Auto-Calculate Calories:
If you leave the "Daily Calorie Goal" field empty, the backend will automatically calculate your ideal calorie intake based on:
- Age
- Weight
- Height
- Gender
- Activity Level
- Goal Type (lose/maintain/gain)

### Real-time Updates:
When you save changes, your profile is immediately updated throughout the app:
- Home screen shows new calorie goal
- Profile screen shows updated info
- Analytics use new goals for calculations

## 🎯 Validation

### Required Fields:
- Name (must not be empty)

### Optional Fields:
- All other fields are optional
- Numeric fields are validated (age, weight, height, calories)
- Dropdown fields have predefined valid values

### Error Handling:
- Shows alert if name is empty
- Shows alert if API call fails
- Displays specific error messages from backend
- Loading indicator prevents double-submission

## 🚀 Usage Example

1. **Open Settings:**
   - Go to Profile tab
   - Tap "⚙️ Edit Profile & Goals"

2. **Update Information:**
   - Change name to "John Doe"
   - Set age to 30
   - Set weight to 75 kg
   - Set height to 180 cm
   - Select "Very Active"
   - Select "Lose Weight"
   - Leave calorie goal empty (auto-calculate)

3. **Save:**
   - Tap "Save Changes"
   - Wait for success message
   - Profile is updated!

## 📊 Backend Response

### Success Response:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "weight": 75,
    "height": 180,
    "gender": "male",
    "activity_level": "very_active",
    "goal_type": "lose_weight",
    "daily_calorie_goal": 2200
  }
}
```

### Error Response:
```json
{
  "error": "Failed to update profile",
  "details": "Specific error message"
}
```

---

**Settings feature is now fully functional!** 🎉

Users can now easily edit their profile and goals from the app!
