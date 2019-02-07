# Map
## JSON structure
```
{
    "center": {
        "lat": [number]
        "lng": [number]
    }
     "markers": [
        [{
            "position": {
                "lat": [number]
                "lng": [number]
            },
            "meta": {
                "any": [any]
            },
            "active": [boolean]
        }]
     ]  
}
```

##### center
`center` defines the start point of view

#### markers
##### position
`position` defines the position of the marker

##### meta
`meta` meta information of the marker

##### active
`active` is marker active (can be selected) or inactive (cannot be selected)

### required
- center
- position
- active
