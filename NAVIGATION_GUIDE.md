# 📱 Navigation Guide - Bottom Tab Bar

## Bottom Navigation Bar (Always Visible)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    SCREEN CONTENT HERE                      │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  🏠 Home  │  ➕ Add Food  │  📊 Analytics  │  👤 Profile   │
│   Green   │     Gray      │      Gray      │     Gray      │
└─────────────────────────────────────────────────────────────┘
```

## Tab Icons

### Home Tab (🏠)
- **Icon**: `home` / `home-outline`
- **Color**: Green when active, Gray when inactive
- **Screen**: HomeScreen
- **Features**:
  - Daily calorie dashboard
  - Progress circle
  - Macronutrients
  - Today's meals (ALL meals, not limited to 5)
  - Camera scanner button (centered)
  - AI insights button

### Add Food Tab (➕)
- **Icon**: `add-circle` / `add-circle-outline`
- **Color**: Green when active, Gray when inactive
- **Screen**: AddFoodScreen
- **Features**:
  - Camera scanner button (top)
  - Manual food entry form
  - Meal type picker
  - Macronutrient inputs
  - Log food button

### Analytics Tab (📊)
- **Icon**: `stats-chart` / `stats-chart-outline`
- **Color**: Green when active, Gray when inactive
- **Screen**: AnalyticsScreen
- **Features**:
  - Weekly/Monthly toggle
  - Total calories
  - Average daily calories
  - Macronutrient breakdown
  - Daily breakdown chart

### Profile Tab (👤)
- **Icon**: `person` / `person-outline`
- **Color**: Green when active, Gray when inactive
- **Screen**: ProfileScreen
- **Features**:
  - User avatar
  - Physical stats
  - Goals display
  - Logout button

## Navigation Flow

```
┌─────────────┐
│   Login     │
│   Screen    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                    Bottom Tab Navigator                  │
├─────────────┬─────────────┬─────────────┬──────────────┤
│             │             │             │              │
│    Home     │  Add Food   │  Analytics  │   Profile    │
│   Screen    │   Screen    │   Screen    │   Screen     │
│             │             │             │              │
│  - Dashboard│  - Manual   │  - Weekly   │  - Stats     │
│  - Meals    │    Entry    │  - Monthly  │  - Goals     │
│  - Camera   │  - Camera   │  - Charts   │  - Logout    │
│    Button   │    Button   │             │              │
│             │             │             │              │
└─────┬───────┴──────┬──────┴──────┬──────┴──────┬───────┘
      │              │             │             │
      └──────────────┴─────────────┴─────────────┘
                     │
                     ▼
            ┌────────────────────┐
            │  Camera Scanner    │
            │     (Modal)        │
            │                    │
            │  - Take Photo      │
            │  - AI Analysis     │
            │  - Confirm & Log   │
            └────────────────────┘
```

## Tab Bar Styling

```javascript
tabBarStyle: {
  backgroundColor: '#fff',        // White background
  borderTopWidth: 1,
  borderTopColor: '#e0e0e0',     // Light gray border
  height: 60,                     // 60px height
  paddingBottom: 8,
  paddingTop: 8,
}

tabBarActiveTintColor: '#4CAF50'  // Green when active
tabBarInactiveTintColor: '#999'   // Gray when inactive

tabBarLabelStyle: {
  fontSize: 12,
  fontWeight: '600',
}
```

## Icon Mapping

| Tab Name  | Active Icon          | Inactive Icon              |
|-----------|---------------------|----------------------------|
| Home      | `home`              | `home-outline`             |
| Add Food  | `add-circle`        | `add-circle-outline`       |
| Analytics | `stats-chart`       | `stats-chart-outline`      |
| Profile   | `person`            | `person-outline`           |

## Navigation Code

```javascript
import { Ionicons } from '@expo/vector-icons';

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AddFood') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AddFood" component={AddFoodScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

## Key Features

✅ **Always Visible**: Bottom tabs are always shown (no hiding)
✅ **No Cross Button**: Tabs don't have close/cross buttons
✅ **Proper Icons**: Using Ionicons from Expo
✅ **Active States**: Icons and text change color when active
✅ **Smooth Navigation**: Instant switching between screens
✅ **Consistent Design**: Same style across all tabs

## User Experience

1. **Tap any tab** to switch screens instantly
2. **Active tab** shows in green with filled icon
3. **Inactive tabs** show in gray with outline icons
4. **No gestures needed** - just tap to navigate
5. **Always accessible** - tabs never hide or disappear

## Camera Scanner Access

The camera scanner can be accessed from:
1. **Home Screen**: Blue camera button (centered)
2. **Add Food Screen**: Blue camera button (top)

Both buttons navigate to the same `ImprovedCameraScannerScreen`.

---

**Everything is working perfectly! No more navigation issues!** 🎉
