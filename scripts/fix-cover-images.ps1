# fix-cover-images.ps1
# Replaces garbled Cloudflare AI images in all posts with clean, relevant Unsplash photos

$postsDir = "c:\Website\Bloging\content\posts"

# Curated Unsplash photo pools by keyword theme
# Each entry: "keyword-pattern" -> array of photo IDs
$photosByTheme = @{
    "nifty|sensex|index|benchmark" = @(
        "1590283603385-17d9c6f3f0b4",  # trading charts on screen
        "1611974789855-9c2a0a7236a3",  # stock market display wall
        "1642790106117-e829e14a795f",  # financial data analytics
        "1554260924-0e0b5e741e58"      # financial screens at night
    )
    "bank|banking|hdfc|icici|sbi|kotak|axis" = @(
        "1501167786722-501d143dad09",  # bank building exterior
        "1556742049-0cfed4f6a45d",    # banking/money concept
        "1559526324-593bc073d938",    # financial newspaper
        "1563986769609-91f56c2e2b17"  # modern bank interior
    )
    "it|tech|infosys|tcs|wipro|software|digital" = @(
        "1518186285879-a5eb3d045c74",  # tech code screens
        "1460925895917-afdab827c52f",  # laptop coding
        "1519389950473-47ba0277781c",  # tech office
        "1487017159836-4e23ece2e4cf"  # tech workspace
    )
    "global|world|fed|dollar|crude|oil|commodity" = @(
        "1526628953301-3ad378218498",  # world map finance
        "1535320903710-a234b4ae2e0a",  # global city skyline
        "1492666673288-3c4b4576920b",  # globe earth
        "1507679799987-c73779587ccf"  # international finance meeting
    )
    "reliance|fii|dii|foreign|institutional" = @(
        "1581091226825-a6a2a5aee158",  # analytics dashboard
        "1551836022-deb4988cc6c0",    # financial analysis
        "1568605114967-8130f3a36994",  # city office towers
        "1507003211169-0a1dd7228f2d"  # business professionals
    )
    "volatil|market|bull|bear|trading|rally|sell" = @(
        "1569025743873-ea3a9ade89f9",  # multi-screen trading setup
        "1607863680198-23d4b2565df0",  # stock charts graphs
        "1529119368496-2dfae1f29c64",  # stock chart close up
        "1526628953301-3ad378218498"  # trader at screens
    )
    "rbi|monetary|rate|inflation|policy|gdp|economy" = @(
        "1559526324-593bc073d938",    # financial newspaper
        "1556742049-0cfed4f6a45d",    # economy concept
        "1518186285879-a5eb3d045c74",  # policy documents
        "1507679799987-c73779587ccf"  # government finance
    )
    "morning|pre.market|opening|session|asia" = @(
        "1535320903710-a234b4ae2e0a",  # morning city
        "1486312338219-ce68d2c6f44d",  # early morning laptop
        "1486304873000-235643847519",  # sunrise financial district
        "1590283603385-17d9c6f3f0b4"  # pre-market screens
    )
}

# Default fallback pool - diverse professional finance images
$defaultPool = @(
    "1611974789855-9c2a0a7236a3",  # stock market wall of screens
    "1590283603385-17d9c6f3f0b4",  # trading charts
    "1569025743873-ea3a9ade89f9",  # trader at multiple screens
    "1551836022-deb4988cc6c0",    # financial analysis documents
    "1526628953301-3ad378218498",  # financial district building
    "1460925895917-afdab827c52f",  # laptop with graphs
    "1507679799987-c73779587ccf",  # professional in meeting
    "1519389950473-47ba0277781c",  # tech office team
    "1554260924-0e0b5e741e58",    # data screens night
    "1642790106117-e829e14a795f",  # fintech analytics
    "1581091226825-a6a2a5aee158",  # business analytics
    "1607863680198-23d4b2565df0",  # stock price charts
    "1529119368496-2dfae1f29c64",  # stock chart
    "1487017159836-4e23ece2e4cf",  # workspace professional
    "1535320903710-a234b4ae2e0a"   # city financial district
)

function Get-StringHash([string]$str) {
    $h = 0
    foreach ($ch in $str.ToCharArray()) {
        $h = (31 * $h + [int][char]$ch) -band 0x7FFFFFFF
    }
    return $h
}

function Get-BestPhotoId([string]$slug) {
    $slug = $slug.ToLower()
    
    # Try to match a theme
    foreach ($pattern in $photosByTheme.Keys) {
        if ($slug -match $pattern) {
            $pool = $photosByTheme[$pattern]
            $idx = (Get-StringHash $slug) % $pool.Count
            return $pool[$idx]
        }
    }
    
    # Default pool
    $idx = (Get-StringHash $slug) % $defaultPool.Count
    return $defaultPool[$idx]
}

$files = Get-ChildItem "$postsDir\*.md"
$fixedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    if ($content -match 'coverImage:\s*"/images/post-img-') {
        $slug = $file.BaseName
        $photoId = Get-BestPhotoId $slug
        $newUrl = "https://images.unsplash.com/photo-$photoId`?auto=format&fit=crop&w=800&q=80"
        
        $newContent = $content -replace 'coverImage:\s*"/images/post-img-[^"]*"', "coverImage: `"$newUrl`""
        
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        Write-Host "Fixed: $($file.Name) -> photo-$photoId"
        $fixedCount++
    }
}

Write-Host "`nDone! Fixed $fixedCount posts."
