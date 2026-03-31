# /api/action Payload Fix

## Problem Resolved
Backend was returning 400 Bad Request because frontend was sending `strategy` field for all actions, but backend only accepts it for `fill_missing` action.

## Fix Applied

### Before (WRONG):
```javascript
// Always sent strategy for ALL actions
api.post('/api/action', { 
  action: actionType, 
  strategy: cleanStrategy  // ❌ Wrong for non-fill_missing actions
});
```

### After (CORRECT):
```javascript
// Conditional payload based on action type
let payload;
if (actionType === 'fill_missing') {
  payload = { action: actionType, strategy: cleanStrategy };  // ✅ Include strategy
} else {
  payload = { action: actionType };  // ✅ Exclude strategy
}

console.log('Sending action payload:', payload);
api.post('/api/action', payload);
```

## Payload Examples

### 1. Fill Missing Values
```json
{
  "action": "fill_missing",
  "strategy": "ai"
}
```

### 2. Remove Duplicates
```json
{
  "action": "remove_duplicates"
}
```

### 3. Remove Outliers
```json
{
  "action": "remove_outliers"
}
```

### 4. Clean Text
```json
{
  "action": "clean_text"
}
```

## Debug Logging Added

Console will now show:
```
=== ACTION START ===
Calling API: /api/action
Action type: remove_duplicates
Sending action payload: { action: "remove_duplicates" }
✅ Action successful: {...}
```

For fill_missing:
```
=== ACTION START ===
Calling API: /api/action
Action type: fill_missing
Strategy: ai
Sending action payload: { action: "fill_missing", strategy: "ai" }
✅ Action successful: {...}
```

## Supported Actions

1. **fill_missing** - Requires `strategy` parameter
   - Strategies: `ai`, `mean`, `median`, `mode`, `drop`

2. **remove_duplicates** - No additional parameters
3. **remove_outliers** - No additional parameters
4. **clean_text** - No additional parameters

## Testing

After deploying this fix:
1. Upload a dataset
2. Try each action:
   - ✅ Fill Missing (with strategy selection)
   - ✅ Remove Duplicates
   - ✅ Remove Outliers
   - ✅ Clean Text

All should work without 400 errors!
