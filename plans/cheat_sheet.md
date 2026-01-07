<div class="markdown-body">
                <div class="markdown-heading"><h1 class="heading-element">The Belfry OpenScad Library, v2. (BOSL2) Cheat Sheet</h1><a id="user-content-the-belfry-openscad-library-v2-bosl2-cheat-sheet" class="anchor" aria-label="Permalink: The Belfry OpenScad Library, v2. (BOSL2) Cheat Sheet" href="#the-belfry-openscad-library-v2-bosl2-cheat-sheet"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h2 class="heading-element">LibFile: constants.scad</h2><a id="user-content-libfile-constantsscad" class="anchor" aria-label="Permalink: LibFile: constants.scad" href="#libfile-constantsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: General Constants</h3><a id="user-content-section-general-constants" class="anchor" aria-label="Permalink: Section: General Constants" href="#section-general-constants"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<p>Constants: <a href="constants.scad#constant-slop"><code>$slop</code></a> <a href="constants.scad#constant-inch"><code>INCH</code></a> <a href="constants.scad#constant-ident"><code>IDENT</code></a></p>
<blockquote>
<p><code>slop = <a href="constants.scad#function-get_slop">get_slop</a>();</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Directional Vectors</h3><a id="user-content-section-directional-vectors" class="anchor" aria-label="Permalink: Section: Directional Vectors" href="#section-directional-vectors"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<p>Constants: <a href="constants.scad#constant-left"><code>LEFT</code></a> <a href="constants.scad#constant-right"><code>RIGHT</code></a> <a href="constants.scad#constant-front"><code>FRONT</code></a> <a href="constants.scad#constant-front"><code>FWD</code></a> <a href="constants.scad#constant-front"><code>FORWARD</code></a> <a href="constants.scad#constant-back"><code>BACK</code></a> <a href="constants.scad#constant-bottom"><code>BOTTOM</code></a> <a href="constants.scad#constant-bottom"><code>BOT</code></a> <a href="constants.scad#constant-bottom"><code>DOWN</code></a> <a href="constants.scad#constant-top"><code>TOP</code></a> <a href="constants.scad#constant-top"><code>UP</code></a> <a href="constants.scad#constant-center"><code>CENTER</code></a> <a href="constants.scad#constant-center"><code>CTR</code></a> <a href="constants.scad#constant-center"><code>CENTRE</code></a></p>
<blockquote>
<p><code><a href="constants.scad#function-edge">EDGE</a>(i)</code>  &nbsp; &nbsp; <code><a href="constants.scad#function-edge">EDGE</a>(direction,i)</code></p>
</blockquote>
<blockquote>
<p><code><a href="constants.scad#function-face">FACE</a>(i)</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Line specifiers</h3><a id="user-content-section-line-specifiers" class="anchor" aria-label="Permalink: Section: Line specifiers" href="#section-line-specifiers"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<p>Constants: <a href="constants.scad#constant-segment"><code>SEGMENT</code></a> <a href="constants.scad#constant-ray"><code>RAY</code></a> <a href="constants.scad#constant-line"><code>LINE</code></a></p>
<div class="markdown-heading"><h2 class="heading-element">LibFile: transforms.scad</h2><a id="user-content-libfile-transformsscad" class="anchor" aria-label="Permalink: LibFile: transforms.scad" href="#libfile-transformsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Translations</h3><a id="user-content-section-translations" class="anchor" aria-label="Permalink: Section: Translations" href="#section-translations"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-move">move</a>(v) CHILDREN;</code>  &nbsp; &nbsp; <code>pts = <a href="transforms.scad#functionmodule-move">move</a>(v, p);</code>  &nbsp; &nbsp; <code>pts = <a href="transforms.scad#functionmodule-move">move</a>(STRING, p);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-move">move</a>(v);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-left">left</a>(x) CHILDREN;</code>  &nbsp; &nbsp; <code>pts = <a href="transforms.scad#functionmodule-left">left</a>(x, p);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-left">left</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-right">right</a>(x) CHILDREN;</code>  &nbsp; &nbsp; <code>pts = <a href="transforms.scad#functionmodule-right">right</a>(x, p);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-right">right</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-fwd">fwd</a>(y) CHILDREN;</code>  &nbsp; &nbsp; <code>pts = <a href="transforms.scad#functionmodule-fwd">fwd</a>(y, p);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-fwd">fwd</a>(y);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-back">back</a>(y) CHILDREN;</code>  &nbsp; &nbsp; <code>pts = <a href="transforms.scad#functionmodule-back">back</a>(y, p);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-back">back</a>(y);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-down">down</a>(z) CHILDREN;</code>  &nbsp; &nbsp; <code>pts = <a href="transforms.scad#functionmodule-down">down</a>(z, p);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-down">down</a>(z);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-up">up</a>(z) CHILDREN;</code>  &nbsp; &nbsp; <code>pts = <a href="transforms.scad#functionmodule-up">up</a>(z, p);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-up">up</a>(z);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Rotations</h3><a id="user-content-section-rotations" class="anchor" aria-label="Permalink: Section: Rotations" href="#section-rotations"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-rot">rot</a>(a, [cp=], [reverse=]) CHILDREN;</code><br>
<code><a href="transforms.scad#functionmodule-rot">rot</a>([X,Y,Z], [cp=], [reverse=]) CHILDREN;</code>  &nbsp; &nbsp; <code><a href="transforms.scad#functionmodule-rot">rot</a>(a, v, [cp=], [reverse=]) CHILDREN;</code><br>
<code><a href="transforms.scad#functionmodule-rot">rot</a>(from=, to=, [a=], [reverse=]) CHILDREN;</code>  &nbsp; &nbsp; <code>pts = <a href="transforms.scad#functionmodule-rot">rot</a>(a, p=, [cp=], [reverse=]);</code><br>
<code>pts = <a href="transforms.scad#functionmodule-rot">rot</a>([X,Y,Z], p=, [cp=], [reverse=]);</code><br>
<code>pts = <a href="transforms.scad#functionmodule-rot">rot</a>(a, v, p=, [cp=], [reverse=]);</code><br>
<code>pts = <a href="transforms.scad#functionmodule-rot">rot</a>([a], from=, to=, p=, [reverse=]);</code>  &nbsp; &nbsp; <code>M = <a href="transforms.scad#functionmodule-rot">rot</a>(a, [cp=], [reverse=]);</code><br>
<code>M = <a href="transforms.scad#functionmodule-rot">rot</a>([X,Y,Z], [cp=], [reverse=]);</code>  &nbsp; &nbsp; <code>M = <a href="transforms.scad#functionmodule-rot">rot</a>(a, v, [cp=], [reverse=]);</code><br>
<code>M = <a href="transforms.scad#functionmodule-rot">rot</a>(from=, to=, [a=], [reverse=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-xrot">xrot</a>(a, [cp=]) CHILDREN;</code>  &nbsp; &nbsp; <code>rotated = <a href="transforms.scad#functionmodule-xrot">xrot</a>(a, p, [cp=]);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-xrot">xrot</a>(a, [cp=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-yrot">yrot</a>(a, [cp=]) CHILDREN;</code>  &nbsp; &nbsp; <code>rotated = <a href="transforms.scad#functionmodule-yrot">yrot</a>(a, p, [cp=]);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-yrot">yrot</a>(a, [cp=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-zrot">zrot</a>(a, [cp=]) CHILDREN;</code>  &nbsp; &nbsp; <code>rotated = <a href="transforms.scad#functionmodule-zrot">zrot</a>(a, p, [cp=]);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-zrot">zrot</a>(a, [cp=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-tilt">tilt</a>(to=, [reverse=], [cp=]) CHILDREN;</code>  &nbsp; &nbsp; <code>pts = <a href="transforms.scad#functionmodule-tilt">tilt</a>(to=, p=, [reverse=], [cp=]);</code><br>
<code>M = <a href="transforms.scad#functionmodule-tilt">tilt</a>(to=, [reverse=], [cp=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Scaling</h3><a id="user-content-section-scaling" class="anchor" aria-label="Permalink: Section: Scaling" href="#section-scaling"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-scale">scale</a>(SCALAR) CHILDREN;</code>  &nbsp; &nbsp; <code><a href="transforms.scad#functionmodule-scale">scale</a>([X,Y,Z]) CHILDREN;</code>  &nbsp; &nbsp; <code>pts = <a href="transforms.scad#functionmodule-scale">scale</a>(v, p, [cp=]);</code><br>
<code>mat = <a href="transforms.scad#functionmodule-scale">scale</a>(v, [cp=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-xscale">xscale</a>(x, [cp=]) CHILDREN;</code>  &nbsp; &nbsp; <code>scaled = <a href="transforms.scad#functionmodule-xscale">xscale</a>(x, p, [cp=]);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-xscale">xscale</a>(x, [cp=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-yscale">yscale</a>(y, [cp=]) CHILDREN;</code>  &nbsp; &nbsp; <code>scaled = <a href="transforms.scad#functionmodule-yscale">yscale</a>(y, p, [cp=]);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-yscale">yscale</a>(y, [cp=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-zscale">zscale</a>(z, [cp=]) CHILDREN;</code>  &nbsp; &nbsp; <code>scaled = <a href="transforms.scad#functionmodule-zscale">zscale</a>(z, p, [cp=]);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-zscale">zscale</a>(z, [cp=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Reflection (Mirroring)</h3><a id="user-content-section-reflection-mirroring" class="anchor" aria-label="Permalink: Section: Reflection (Mirroring)" href="#section-reflection-mirroring"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-mirror">mirror</a>(v) CHILDREN;</code>  &nbsp; &nbsp; <code>pt = <a href="transforms.scad#functionmodule-mirror">mirror</a>(v, p);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-mirror">mirror</a>(v);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-xflip">xflip</a>([x=]) CHILDREN;</code>  &nbsp; &nbsp; <code>pt = <a href="transforms.scad#functionmodule-xflip">xflip</a>(p, [x]);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-xflip">xflip</a>([x=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-yflip">yflip</a>([y=]) CHILDREN;</code>  &nbsp; &nbsp; <code>pt = <a href="transforms.scad#functionmodule-yflip">yflip</a>(p, [y]);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-yflip">yflip</a>([y=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-zflip">zflip</a>([z=]) CHILDREN;</code>  &nbsp; &nbsp; <code>pt = <a href="transforms.scad#functionmodule-zflip">zflip</a>(p, [z]);</code>  &nbsp; &nbsp; <code>mat = <a href="transforms.scad#functionmodule-zflip">zflip</a>([z=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Other Transformations</h3><a id="user-content-section-other-transformations" class="anchor" aria-label="Permalink: Section: Other Transformations" href="#section-other-transformations"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-frame_map">frame_map</a>(v1, v2, v3, [reverse=]) CHILDREN;</code><br>
<code>transformed = <a href="transforms.scad#functionmodule-frame_map">frame_map</a>(v1, v2, v3, p=points, [reverse=]);</code><br>
<code>map = <a href="transforms.scad#functionmodule-frame_map">frame_map</a>(v1, v2, v3, [reverse=]);</code><br>
<code>map = <a href="transforms.scad#functionmodule-frame_map">frame_map</a>(x=VECTOR1, y=VECTOR2, [reverse=]);</code><br>
<code>map = <a href="transforms.scad#functionmodule-frame_map">frame_map</a>(x=VECTOR1, z=VECTOR2, [reverse=]);</code><br>
<code>map = <a href="transforms.scad#functionmodule-frame_map">frame_map</a>(y=VECTOR1, z=VECTOR2, [reverse=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="transforms.scad#functionmodule-skew">skew</a>([sxy=]|[axy=], [sxz=]|[axz=], [syx=]|[ayx=], [syz=]|[ayz=], [szx=]|[azx=], [szy=]|[azy=]) CHILDREN;</code><br>
<code>pts = <a href="transforms.scad#functionmodule-skew">skew</a>(p, [sxy=]|[axy=], [sxz=]|[axz=], [syx=]|[ayx=], [syz=]|[ayz=], [szx=]|[azx=], [szy=]|[azy=]);</code><br>
<code>mat = <a href="transforms.scad#functionmodule-skew">skew</a>([sxy=]|[axy=], [sxz=]|[axz=], [syx=]|[ayx=], [syz=]|[ayz=], [szx=]|[azx=], [szy=]|[azy=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Applying transformation matrices to data</h3><a id="user-content-section-applying-transformation-matrices-to-data" class="anchor" aria-label="Permalink: Section: Applying transformation matrices to data" href="#section-applying-transformation-matrices-to-data"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>pts = <a href="transforms.scad#function-apply">apply</a>(transform, points);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: attachments.scad</h2><a id="user-content-libfile-attachmentsscad" class="anchor" aria-label="Permalink: LibFile: attachments.scad" href="#libfile-attachmentsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Attachment Positioning</h3><a id="user-content-section-attachment-positioning" class="anchor" aria-label="Permalink: Section: Attachment Positioning" href="#section-attachment-positioning"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>PARENT() <a href="attachments.scad#module-position">position</a>(at) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() <a href="attachments.scad#module-orient">orient</a>(anchor, [spin]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() <a href="attachments.scad#module-align">align</a>(anchor, [<a href="attachments.scad#module-align">align</a>], [inside=], [inset=], [shiftout=], [overlap=]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() <a href="attachments.scad#module-attach">attach</a>(parent, child, [align=], [spin=], [overlap=], [inside=], [inset=], [shiftout=]) CHILDREN;</code><br>
<code>PARENT() <a href="attachments.scad#module-attach">attach</a>(parent, [overlap=], [spin=]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() <a href="attachments.scad#module-attach_part">attach_part</a>(name, [ind]) CHILDREN;</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Tagging</h3><a id="user-content-section-tagging" class="anchor" aria-label="Permalink: Section: Tagging" href="#section-tagging"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>PARENT() <a href="attachments.scad#module-tag">tag</a>(<a href="attachments.scad#module-tag">tag</a>) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() tag(tag) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() <a href="attachments.scad#module-force_tag">force_tag</a>([tag]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() <a href="attachments.scad#module-default_tag">default_tag</a>(tag) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-tag_scope">tag_scope</a>([scope]) CHILDREN;</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Tagged Operations with Attachable Objects</h3><a id="user-content-section-tagged-operations-with-attachable-objects" class="anchor" aria-label="Permalink: Section: Tagged Operations with Attachable Objects" href="#section-tagged-operations-with-attachable-objects"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="attachments.scad#module-diff">diff</a>([remove], [keep]) PARENT() CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-tag_diff">tag_diff</a>([tag], [remove], [keep]) PARENT() CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-intersect">intersect</a>([<a href="attachments.scad#module-intersect">intersect</a>], [keep]) PARENT() CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-tag_intersect">tag_intersect</a>([tag], [intersect], [keep]) PARENT() CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-conv_hull">conv_hull</a>([keep]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-tag_conv_hull">tag_conv_hull</a>([tag], [keep]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-hide">hide</a>(tags) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-hide_this">hide_this</a>() CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-show_only">show_only</a>(tags) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-show_int">show_int</a>(tags) CHILDREN;</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Making your objects attachable</h3><a id="user-content-section-making-your-objects-attachable" class="anchor" aria-label="Permalink: Section: Making your objects attachable" href="#section-making-your-objects-attachable"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="attachments.scad#module-attachable">attachable</a>(anchor, spin, two_d=true, size=, [size2=], [shift=], [override=], ...) {OBJECT; children();}</code><br>
<code><a href="attachments.scad#module-attachable">attachable</a>(anchor, spin, two_d=true, r=|d=, ...) {OBJECT; children();}</code><br>
<code><a href="attachments.scad#module-attachable">attachable</a>(anchor, spin, two_d=true, path=, [extent=], ...) {OBJECT; children();}</code><br>
<code><a href="attachments.scad#module-attachable">attachable</a>(anchor, spin, two_d=true, region=, [extent=], ...) {OBJECT; children();}</code><br>
<code><a href="attachments.scad#module-attachable">attachable</a>(anchor, spin, [orient], size=, [size2=], [shift=], [override=],  ...) {OBJECT; children();}</code><br>
<code><a href="attachments.scad#module-attachable">attachable</a>(anchor, spin, [orient], r=|d=, l=, [axis=], ...) {OBJECT; children();}</code><br>
<code><a href="attachments.scad#module-attachable">attachable</a>(anchor, spin, [orient], r1=|d1=, r2=|d2=, l=, [axis=], ...) {OBJECT; children();}</code><br>
<code><a href="attachments.scad#module-attachable">attachable</a>(anchor, spin, [orient], r=|d=, ...) {OBJECT; children();}</code><br>
<code><a href="attachments.scad#module-attachable">attachable</a>(anchor, spin, path=, l=|h=, [extent=], ...) {OBJECT; children();}</code><br>
<code><a href="attachments.scad#module-attachable">attachable</a>(anchor, spin, region=, l=|h=, [extent=], ...) {OBJECT; children();}</code><br>
<code><a href="attachments.scad#module-attachable">attachable</a>(anchor, spin, [orient], vnf=, [extent=], ...) {OBJECT; children();}</code><br>
<code><a href="attachments.scad#module-attachable">attachable</a>(anchor, spin, [orient], geom=) {OBJECT; children();}</code></p>
</blockquote>
<blockquote>
<p><code>mat = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], two_d=true, size=, [size2=], [shift=], ...);</code><br>
<code>pts = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], two_d=true, size=, [size2=], [shift=], p=, ...);</code><br>
<code>mat = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], two_d=true, r=|d=, ...);</code><br>
<code>pts = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], two_d=true, r=|d=, p=, ...);</code><br>
<code>mat = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], two_d=true, path=, [extent=], ...);</code><br>
<code>pts = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], two_d=true, path=, [extent=], p=, ...);</code><br>
<code>mat = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], two_d=true, region=, [extent=], ...);</code><br>
<code>pts = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], two_d=true, region=, [extent=], p=, ...);</code><br>
<code>mat = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], size=, [size2=], [shift=], ...);</code><br>
<code>vnf = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], size=, [size2=], [shift=], p=, ...);</code><br>
<code>mat = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], r=|d=, l=, [axis=], ...);</code><br>
<code>vnf = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], r=|d=, l=, [axis=], p=, ...);</code><br>
<code>mat = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], r1=|d1=, r2=|d2=, l=, [axis=], ...);</code><br>
<code>vnf = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], r1=|d1=, r2=|d2=, l=, [axis=], p=, ...);</code><br>
<code>mat = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], r|d=, ...);</code><br>
<code>vnf = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], r|d=, p=, ...);</code><br>
<code>mat = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], path=, l=|h=, [extent=], ...);</code><br>
<code>vnf = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], path=, l=|h=, [extent=], p=, ...);</code><br>
<code>mat = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], region=, l=|h=, [extent=], ...);</code><br>
<code>vnf = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], region=, l=|h=, [extent=], p=, ...);</code><br>
<code>mat = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], vnf, [extent], ...);</code><br>
<code>vnf = <a href="attachments.scad#function-reorient">reorient</a>(anchor, spin, [orient], vnf, [extent], p=, ...);</code></p>
</blockquote>
<blockquote>
<p><code>a = <a href="attachments.scad#function-named_anchor">named_anchor</a>(name, pos, [orient], [spin]);</code><br>
<code>a = <a href="attachments.scad#function-named_anchor">named_anchor</a>(name, [pos], rot=, [flip=]);</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() <a href="attachments.scad#module-change_anchors">change_anchors</a>([named],[alias=],[remove=]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>geom = <a href="attachments.scad#function-attach_geom">attach_geom</a>(...);</code><br>
<code>geom = <a href="attachments.scad#function-attach_geom">attach_geom</a>(two_d=true, size=, [size2=], [shift=], ...);</code><br>
<code>geom = <a href="attachments.scad#function-attach_geom">attach_geom</a>(two_d=true, r=|d=, ...);</code><br>
<code>geom = <a href="attachments.scad#function-attach_geom">attach_geom</a>(two_d=true, region=, [extent=], ...);</code><br>
<code>geom = <a href="attachments.scad#function-attach_geom">attach_geom</a>(size=, [size2=], [shift=], ...);</code><br>
<code>geom = <a href="attachments.scad#function-attach_geom">attach_geom</a>(r=|d=, l=|h=, [axis=], ...);</code><br>
<code>geom = <a href="attachments.scad#function-attach_geom">attach_geom</a>(r1|d1=, r2=|d2=, l=, [axis=], ...);</code><br>
<code>geom = <a href="attachments.scad#function-attach_geom">attach_geom</a>(r=|d=, ...);</code><br>
<code>geom = <a href="attachments.scad#function-attach_geom">attach_geom</a>(region=, l=|h=, [extent=], [shift=], [scale=], [twist=], ...);</code><br>
<code>geom = <a href="attachments.scad#function-attach_geom">attach_geom</a>(vnf=, [extent=], ...);</code></p>
</blockquote>
<blockquote>
<p><code>part = <a href="attachments.scad#function-define_part">define_part</a>(name, geom, [inside=], [T=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Visualizing Anchors</h3><a id="user-content-section-visualizing-anchors" class="anchor" aria-label="Permalink: Section: Visualizing Anchors" href="#section-visualizing-anchors"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>PARENT() <a href="attachments.scad#module-show_anchors">show_anchors</a>([s], [std=], [custom=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-anchor_arrow">anchor_arrow</a>([s], [color], [flag], [anchor=], [orient=], [spin=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-anchor_arrow2d">anchor_arrow2d</a>([s], [color]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-expose_anchors">expose_anchors</a>(opacity) {child1() show_anchors(); child2() show_anchors(); ...}</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-show_transform_list">show_transform_list</a>(tlist, [s]);</code>  &nbsp; &nbsp; <code><a href="attachments.scad#module-show_transform_list">show_transform_list</a>(tlist) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-generic_airplane">generic_airplane</a>([s]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-frame_ref">frame_ref</a>(s, opacity);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Attachable Descriptions for Operating on Attachables or Restoring a Previous State</h3><a id="user-content-section-attachable-descriptions-for-operating-on-attachables-or-restoring-a-previous-state" class="anchor" aria-label="Permalink: Section: Attachable Descriptions for Operating on Attachables or Restoring a Previous State" href="#section-attachable-descriptions-for-operating-on-attachables-or-restoring-a-previous-state"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>PARENT() let( desc = <a href="attachments.scad#function-parent">parent</a>() ) CHILDREN;</code>  &nbsp; &nbsp; <code>PARENT() { desc=<a href="attachments.scad#function-parent">parent</a>(); CHILDREN; }</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() let( desc = <a href="attachments.scad#function-parent_part">parent_part</a>(name, [ind]) ) CHILDREN;</code><br>
<code>PARENT() { desc=<a href="attachments.scad#function-parent_part">parent_part</a>(name, [ind]); CHILDREN; }</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-restore">restore</a>([desc]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>point = <a href="attachments.scad#function-desc_point">desc_point</a>(desc,[p],[anchor]);</code></p>
</blockquote>
<blockquote>
<p><code>dir = desc_anchor(desc,[dir], [anchor]);</code></p>
</blockquote>
<blockquote>
<p><code>dist = <a href="attachments.scad#function-desc_dist">desc_dist</a>(desc1,anchor1,desc2,anchor2);</code><br>
<code>dest = <a href="attachments.scad#function-desc_dist">desc_dist</a>(desc1=, desc2=, [anchor1=], [anchor2=]);</code></p>
</blockquote>
<blockquote>
<p><code>new_desc = <a href="attachments.scad#function-transform_desc">transform_desc</a>(T, desc);</code></p>
</blockquote>
<blockquote>
<p><code><a href="attachments.scad#module-desc_copies">desc_copies</a>(transforms) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="attachments.scad#function-is_description">is_description</a>(desc);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: shapes2d.scad</h2><a id="user-content-libfile-shapes2dscad" class="anchor" aria-label="Permalink: LibFile: shapes2d.scad" href="#libfile-shapes2dscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: 2D Primitives</h3><a id="user-content-section-2d-primitives" class="anchor" aria-label="Permalink: Section: 2D Primitives" href="#section-2d-primitives"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-square">square</a>(size, [center], ...);</code><br>
<code><a href="shapes2d.scad#functionmodule-square">square</a>(size, [center], ...) [ATTACHMENTS];</code>  &nbsp; &nbsp; <code>path = <a href="shapes2d.scad#functionmodule-square">square</a>(size, [center], ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-rect">rect</a>(size, [rounding], [chamfer], ...) [ATTACHMENTS];</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-rect">rect</a>(size, [rounding], [chamfer], ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-circle">circle</a>(r|d=, ...) [ATTACHMENTS];</code>  &nbsp; &nbsp; <code><a href="shapes2d.scad#functionmodule-circle">circle</a>(points=) [ATTACHMENTS];</code><br>
<code><a href="shapes2d.scad#functionmodule-circle">circle</a>(r|d=, corner=) [ATTACHMENTS];</code>  &nbsp; &nbsp; <code>path = <a href="shapes2d.scad#functionmodule-circle">circle</a>(r|d=, ...);</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-circle">circle</a>(points=);</code>  &nbsp; &nbsp; <code>path = <a href="shapes2d.scad#functionmodule-circle">circle</a>(r|d=, corner=);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-ellipse">ellipse</a>(r|d=, [realign=], [circum=], [uniform=], ...) [ATTACHMENTS];</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-ellipse">ellipse</a>(r|d=, [realign=], [circum=], [uniform=], ...);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Polygons</h3><a id="user-content-section-polygons" class="anchor" aria-label="Permalink: Section: Polygons" href="#section-polygons"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-regular_ngon">regular_ngon</a>(n, r|d=|or=|od=, [realign=]) [ATTACHMENTS];</code><br>
<code><a href="shapes2d.scad#functionmodule-regular_ngon">regular_ngon</a>(n, ir=|id=, [realign=]) [ATTACHMENTS];</code><br>
<code><a href="shapes2d.scad#functionmodule-regular_ngon">regular_ngon</a>(n, side=, [realign=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-pentagon">pentagon</a>(or|od=, [realign=], [align_tip=|align_side=]) [ATTACHMENTS];</code><br>
<code><a href="shapes2d.scad#functionmodule-pentagon">pentagon</a>(ir=|id=, [realign=], [align_tip=|align_side=]) [ATTACHMENTS];</code><br>
<code><a href="shapes2d.scad#functionmodule-pentagon">pentagon</a>(side=, [realign=], [align_tip=|align_side=]) [ATTACHMENTS];</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-pentagon">pentagon</a>(...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-hexagon">hexagon</a>(r/or, [realign=], &lt;align_tip=|align_side=&gt;, [rounding=], ...) [ATTACHMENTS];</code><br>
<code><a href="shapes2d.scad#functionmodule-hexagon">hexagon</a>(d=/od=, ...) [ATTACHMENTS];</code>  &nbsp; &nbsp; <code><a href="shapes2d.scad#functionmodule-hexagon">hexagon</a>(ir=/id=, ...) [ATTACHMENTS];</code><br>
<code><a href="shapes2d.scad#functionmodule-hexagon">hexagon</a>(side=, ...) [ATTACHMENTS];</code>  &nbsp; &nbsp; <code>path = <a href="shapes2d.scad#functionmodule-hexagon">hexagon</a>(...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-octagon">octagon</a>(r/or, [realign=], [align_tip=|align_side=], [rounding=], ...) [ATTACHMENTS];</code><br>
<code><a href="shapes2d.scad#functionmodule-octagon">octagon</a>(d=/od=, ...) [ATTACHMENTS];</code>  &nbsp; &nbsp; <code><a href="shapes2d.scad#functionmodule-octagon">octagon</a>(ir=/id=, ...) [ATTACHMENTS];</code><br>
<code><a href="shapes2d.scad#functionmodule-octagon">octagon</a>(side=, ...) [ATTACHMENTS];</code>  &nbsp; &nbsp; <code>path = <a href="shapes2d.scad#functionmodule-octagon">octagon</a>(...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-right_triangle">right_triangle</a>(size, [center], ...) [ATTACHMENTS];</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-right_triangle">right_triangle</a>(size, [center], ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-trapezoid">trapezoid</a>(h, w1, w2, [shift=], [rounding=], [chamfer=], [flip=], ...) [ATTACHMENTS];</code><br>
<code><a href="shapes2d.scad#functionmodule-trapezoid">trapezoid</a>(h, w1, ang=, [rounding=], [chamfer=], [flip=], ...) [ATTACHMENTS];</code><br>
<code><a href="shapes2d.scad#functionmodule-trapezoid">trapezoid</a>(h, w2=, ang=, [rounding=], [chamfer=], [flip=], ...) [ATTACHMENTS];</code><br>
<code><a href="shapes2d.scad#functionmodule-trapezoid">trapezoid</a>(w1=, w2=, ang=, [rounding=], [chamfer=], [flip=], ...) [ATTACHMENTS];</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-trapezoid">trapezoid</a>(...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-star">star</a>(n, r/or, ir, [realign=], [align_tip=], [align_pit=], ...) [ATTACHMENTS];</code><br>
<code><a href="shapes2d.scad#functionmodule-star">star</a>(n, r/or, step=, ...) [ATTACHMENTS];</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-star">star</a>(n, r/or, ir, [realign=], [align_tip=], [align_pit=], ...);</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-star">star</a>(n, r/or, step=, ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#module-jittered_poly">jittered_poly</a>(path, [dist]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Curved 2D Shapes</h3><a id="user-content-section-curved-2d-shapes" class="anchor" aria-label="Permalink: Section: Curved 2D Shapes" href="#section-curved-2d-shapes"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-teardrop2d">teardrop2d</a>(r/d=, [ang], [cap_h], [circum=], [realign=], [bot_corner=]) [ATTACHMENTS];</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-teardrop2d">teardrop2d</a>(r|d=, [ang], [cap_h], [circum=], [realign=], [bot_corner=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-egg">egg</a>(length, r1|d1=, r2|d2=, R|D=) [ATTACHMENTS];</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-egg">egg</a>(length, r1|d1=, r2|d2=, R|D=);</code></p>
</blockquote>
<blockquote>
<p><code>region=<a href="shapes2d.scad#functionmodule-ring">ring</a>(n, r1=|d1=, r2=|d2=, [full=], [angle=], [start=]);</code><br>
<code>region=<a href="shapes2d.scad#functionmodule-ring">ring</a>(n, <a href="shapes2d.scad#functionmodule-ring">ring</a>_width, r=|d=, [full=], [angle=], [start=]);</code><br>
<code>region=<a href="shapes2d.scad#functionmodule-ring">ring</a>(n, [<a href="shapes2d.scad#functionmodule-ring">ring</a>_width], [r=,d=], points=[P0,P1,P2], [full=]);</code><br>
<code>region=<a href="shapes2d.scad#functionmodule-ring">ring</a>(n, corner=[P0,P1,P2], r1=|d1=, r2=|d2=, [full=]);</code><br>
<code>region=<a href="shapes2d.scad#functionmodule-ring">ring</a>(n, [<a href="shapes2d.scad#functionmodule-ring">ring</a>_width], [r=|d=], width=, thickness=, [full=]);</code><br>
<code><a href="shapes2d.scad#functionmodule-ring">ring</a>(...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-glued_circles">glued_circles</a>(r/d=, [spread], [r1=/d1=], [r2=/d2=], [tangent=], [bulge=], [width=], [blendR=/blendD=], anchor=, spin=) [ATTACHMENTS];</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-glued_circles">glued_circles</a>(r/d=, [spread], [r1=/d1=], [r2=/d2=], [tangent=], [bulge=], [width=], [blendR=/blendD=], anchor=, spin=) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-squircle">squircle</a>(size, [squareness], [style=]) [ATTACHMENTS];</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-squircle">squircle</a>(size, [squareness], [style=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-keyhole">keyhole</a>(l/length=, r1/d1=, r2/d2=, [shoulder_r=], ...) [ATTACHMENTS];</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-keyhole">keyhole</a>(l/length=, r1/d1=, r2/d2=, [shoulder_r=], ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-reuleaux_polygon">reuleaux_polygon</a>(n, r|d=, ...) [ATTACHMENTS];</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-reuleaux_polygon">reuleaux_polygon</a>(n, r|d=, ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#functionmodule-supershape">supershape</a>([step],[n=], [m1=], [m2=], [n1=], [n2=], [n3=], [a=], [b=], [r=/d=]) [ATTACHMENTS];</code><br>
<code>path = <a href="shapes2d.scad#functionmodule-supershape">supershape</a>([step], [n=], [m1=], [m2=], [n1=], [n2=], [n3=], [a=], [b=], [r=/d=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Text</h3><a id="user-content-section-text" class="anchor" aria-label="Permalink: Section: Text" href="#section-text"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="shapes2d.scad#module-text">text</a>(<a href="shapes2d.scad#module-text">text</a>, [size], [font], ...);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Rounding 2D shapes</h3><a id="user-content-section-rounding-2d-shapes" class="anchor" aria-label="Permalink: Section: Rounding 2D shapes" href="#section-rounding-2d-shapes"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="shapes2d.scad#module-round2d">round2d</a>(r) [ATTACHMENTS];</code>  &nbsp; &nbsp; <code><a href="shapes2d.scad#module-round2d">round2d</a>(or=) [ATTACHMENTS];</code>  &nbsp; &nbsp; <code><a href="shapes2d.scad#module-round2d">round2d</a>(ir=) [ATTACHMENTS];</code><br>
<code><a href="shapes2d.scad#module-round2d">round2d</a>(or=, ir=) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes2d.scad#module-shell2d">shell2d</a>(thickness, [or], [ir])</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: shapes3d.scad</h2><a id="user-content-libfile-shapes3dscad" class="anchor" aria-label="Permalink: LibFile: shapes3d.scad" href="#libfile-shapes3dscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Cuboids, Prismoids and Pyramids</h3><a id="user-content-section-cuboids-prismoids-and-pyramids" class="anchor" aria-label="Permalink: Section: Cuboids, Prismoids and Pyramids" href="#section-cuboids-prismoids-and-pyramids"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-cube">cube</a>(size, [center]);</code><br>
<code><a href="shapes3d.scad#functionmodule-cube">cube</a>(size, [center], [anchor=], [spin=], [orient=]) [ATTACHMENTS];</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-cube">cube</a>(size, ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#module-cuboid">cuboid</a>(size, [anchor=], [spin=], [orient=]);</code>  &nbsp; &nbsp; <code><a href="shapes3d.scad#module-cuboid">cuboid</a>(size, p1=, ...);</code><br>
<code><a href="shapes3d.scad#module-cuboid">cuboid</a>(p1=, p2=, ...);</code><br>
<code><a href="shapes3d.scad#module-cuboid">cuboid</a>(size, [chamfer=], [edges=], [except=], [trimcorners=], ...);</code><br>
<code><a href="shapes3d.scad#module-cuboid">cuboid</a>(size, [rounding=], [teardrop=], [edges=], [except=], [trimcorners=], ...);</code><br>
<code><a href="shapes3d.scad#module-cuboid">cuboid</a>(...) ATTACHMENTS;</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-prismoid">prismoid</a>(size1, size2, [h|l|height|length], [shift], [xang=], [yang=], ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-prismoid">prismoid</a>(size1, size2, h|l|height|length, [chamfer=], [rounding=]...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-prismoid">prismoid</a>(size1, size2, h|l|height|length, [chamfer1=], [chamfer2=], [rounding1=], [rounding2=], ...) [ATTACHMENTS];</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-prismoid">prismoid</a>(...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-regular_prism">regular_prism</a>(n, h|l=|height=|length=, r, [center=], [realign=]) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-regular_prism">regular_prism</a>(n, h|l=|height=|length=, d=|id=|od=|ir=|or=|side=, ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-regular_prism">regular_prism</a>(n, h|l=|height=|length=, r1=|d1=|id1=|od1=|ir1=|or1=|side1=,r2=|d2=|id2=|od2=|ir2=|or2=|side2=, ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-regular_prism">regular_prism</a>(n, h, r, chamfer=, [chamfang=], [from_end=], ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-regular_prism">regular_prism</a>(n, h, r, chamfer1=, [chamfang1=], [from_end=], ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-regular_prism">regular_prism</a>(n, h, r, chamfer2=, [chamfang2=], [from_end=], ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-regular_prism">regular_prism</a>(n, h, r, chamfer1=, chamfer2=, [chamfang1=], [chamfang2=], [from_end=], ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-regular_prism">regular_prism</a>(n, h, r, rounding=, ...);</code>  &nbsp; &nbsp; <code><a href="shapes3d.scad#functionmodule-regular_prism">regular_prism</a>(n, h, r, rounding1=, ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-regular_prism">regular_prism</a>(n, h, r, rounding2=, ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-regular_prism">regular_prism</a>(n, h, r, rounding1=, rounding2=, ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-regular_prism">regular_prism</a>(n, h, r, texture=, [tex_size=]|[tex_reps=], [tex_depth=], [tex_rot=], [tex_samples=], [style=], [tex_inset=], ...);</code><br>
<code>vnf = rounded_prism(...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-textured_tile">textured_tile</a>(texture, [size], [w1=], [w2=], [ang=], [shift=], [h=/height=/thickness=], [atype=], [diff=], [tex_extra=], [tex_skip=], ...) [ATTACHMENTS];</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-textured_tile">textured_tile</a>(texture, [size], [w1=], [w2=], [ang=], [shift=], [h=/height=/thickness=], [atype=], [tex_extra=], [tex_skip=], ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, size, isize, [center], [shift]);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, size, wall=, [center=]);</code>  &nbsp; &nbsp; <code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, isize=, wall=, [center=]);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, size1=, size2=, wall=, ...);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, isize1=, isize2=, wall=, ...);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, size1=, size2=, isize1=, isize2=, ...);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, size, isize, chamfer=, ...);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, size, isize, chamfer1=, chamfer2= ...);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, size, isize, ichamfer=, ...);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, size, isize, ichamfer1=, ichamfer2= ...);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, size, isize, chamfer=, ichamfer=, ...);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, size, isize, rounding=, ...);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, size, isize, rounding1=, rounding2= ...);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, size, isize, irounding=, ...);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, size, isize, irounding1=, irounding2= ...);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(h, size, isize, rounding=, irounding=, ...);</code><br>
<code><a href="shapes3d.scad#module-rect_tube">rect_tube</a>(...) ATTACHMENTS;</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-wedge">wedge</a>(size, [center], ...) [ATTACHMENTS];</code>  &nbsp; &nbsp; <code>vnf = <a href="shapes3d.scad#functionmodule-wedge">wedge</a>(size, [center], ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-octahedron">octahedron</a>(size, ...) [ATTACHMENTS];</code>  &nbsp; &nbsp; <code>vnf = <a href="shapes3d.scad#functionmodule-octahedron">octahedron</a>(size, ...);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Cylinders</h3><a id="user-content-section-cylinders" class="anchor" aria-label="Permalink: Section: Cylinders" href="#section-cylinders"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-cylinder">cylinder</a>(h, r=/d=, [center=]);</code>  &nbsp; &nbsp; <code><a href="shapes3d.scad#functionmodule-cylinder">cylinder</a>(h, r1/d1=, r2/d2=, [center=]);</code><br>
<code><a href="shapes3d.scad#functionmodule-cylinder">cylinder</a>(h, r=/d=, [center=], [anchor=], [spin=], [orient=]) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-cylinder">cylinder</a>(h, r1/d1=, r2/d2=, [center=], [anchor=], [spin=], [orient=]) [ATTACHMENTS];</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-cylinder">cylinder</a>(h, r=/d=, ...);</code>  &nbsp; &nbsp; <code>vnf = <a href="shapes3d.scad#functionmodule-cylinder">cylinder</a>(h, r1/d1=, r2/d2=, ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, r, [center], [circum=], [realign=]) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, d=, ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, r1=, r2=, ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, d1=, d2=, ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, r|d, chamfer=, [chamfang=], [from_end=], ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, r|d, chamfer1=, [chamfang1=], [from_end=], ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, r|d, chamfer2=, [chamfang2=], [from_end=], ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, r|d, chamfer1=, chamfer2=, [chamfang1=], [chamfang2=], [from_end=], ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, r|d, rounding=, [teardrop=], [clip_angle=], ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, r|d, rounding1=, [teardrop=], [clip_angle=], ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, r|d, rounding2=, [teardrop=], [clip_angle=], ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, r|d, rounding1=, rounding2=, [teardrop=], [clip_angle=], ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, r|d, texture=, [tex_size=]|[tex_reps=], [tex_depth=], [tex_rot=], [tex_samples=], [style=], [tex_taper=], [tex_inset=], ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, r1=, r2=, texture=, [tex_size=]|[tex_reps=], [tex_depth=], [tex_rot=], [tex_samples=], [style=], [tex_taper=], [tex_inset=], ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-cyl">cyl</a>(l|h|length|height, d1=, d2=, texture=, [tex_size=]|[tex_reps=], [tex_depth=], [tex_rot=], [tex_samples=], [style=], [tex_taper=], [tex_inset=], ...);</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-cyl">cyl</a>(...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-xcyl">xcyl</a>(l|h|length|height, r|d=, [anchor=], ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-xcyl">xcyl</a>(l|h|length|height, r1=|d1=, r2=|d2=, [anchor=], ...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#module-tube">tube</a>(h|l, or, ir, [center], [realign=], [anchor=], [spin=],[orient=]) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#module-tube">tube</a>(h|l, od=, id=, ...)  [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#module-tube">tube</a>(h|l, or|od=|ir=|id=, wall=, ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#module-tube">tube</a>(h|l, ir1=|id1=, ir2=|id2=, or1=|od1=, or2=|od2=, ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#module-tube">tube</a>(h|l, or1=|od1=, or2=|od2=, wall=, ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#module-tube">tube</a>(..., [rounding=], [irounding=], [orounding=], [rounding1=], [rounding2=], [irounding1=], [irounding2=], [orounding1=], [orounding2=], [teardrop=], [clip_angle=]);</code><br>
<code><a href="shapes3d.scad#module-tube">tube</a>(..., [chamfer=], [ichamfer=], [ochamfer=], [chamfer1=], [chamfer2=], [ichamfer1=], [ichamfer2=], [ochamfer1=], [ochamfer2=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-pie_slice">pie_slice</a>(l|h=|height=|length=, r, ang, [center]);</code><br>
<code><a href="shapes3d.scad#functionmodule-pie_slice">pie_slice</a>(l|h=|height=|length=, d=, ang=, ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-pie_slice">pie_slice</a>(l|h=|height=|length=, r1=|d1=, r2=|d2=, ang=, ...);</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-pie_slice">pie_slice</a>(l|h=|height=|length=, r, ang, [center]);</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-pie_slice">pie_slice</a>(l|h=|height=|length=, d=, ang=, ...);</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-pie_slice">pie_slice</a>(l|h=|height=|length=, r1=|d1=, r2=|d2=, ang=, ...);</code><br>
<code><a href="shapes3d.scad#functionmodule-pie_slice">pie_slice</a>(l|h, r, ang, ...) ATTACHMENTS;</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Other Round Objects</h3><a id="user-content-section-other-round-objects" class="anchor" aria-label="Permalink: Section: Other Round Objects" href="#section-other-round-objects"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-sphere">sphere</a>(r|d=);</code><br>
<code><a href="shapes3d.scad#functionmodule-sphere">sphere</a>(r|d=, [anchor=], [spin=], [orient=]) [ATTACHMENTS];</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-sphere">sphere</a>(r|d=, [anchor=], [spin=], [orient=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-spheroid">spheroid</a>(r|d, [circum], [style]) [ATTACHMENTS];</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-spheroid">spheroid</a>(r|d, [circum], [style]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-torus">torus</a>(r_maj|d_maj, r_min|d_min, [center], ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-torus">torus</a>(or|od, ir|id, ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-torus">torus</a>(r_maj|d_maj, or|od, ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-torus">torus</a>(r_maj|d_maj, ir|id, ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-torus">torus</a>(r_min|d_min, or|od, ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-torus">torus</a>(r_min|d_min, ir|id, ...) [ATTACHMENTS];</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-torus">torus</a>(r_maj|d_maj, r_min|d_min, [center], ...);</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-torus">torus</a>(or|od, ir|id, ...);</code>  &nbsp; &nbsp; <code>vnf = <a href="shapes3d.scad#functionmodule-torus">torus</a>(r_maj|d_maj, or|od, ...);</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-torus">torus</a>(r_maj|d_maj, ir|id, ...);</code>  &nbsp; &nbsp; <code>vnf = <a href="shapes3d.scad#functionmodule-torus">torus</a>(r_min|d_min, or|od, ...);</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-torus">torus</a>(r_min|d_min, ir|id, ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-teardrop">teardrop</a>(h|l=|length=|height=, r, [ang], [cap_h], [chamfer=], [bot_corner=], ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-teardrop">teardrop</a>(h|l=|length=|height=, d=, [ang=], [cap_h=], [chamfer=], [bot_corner=], ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-teardrop">teardrop</a>(h|l=|height=|length=, r1=, r2=, [ang=], [cap_h1=], [cap_h2=], [bot_corner1=], [bot_corner2=], ...)  [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-teardrop">teardrop</a>(h|l=|height=|length=, d1=, d2=, [ang=], [cap_h1=], [cap_h2=], [bot_corner1=], [bot_corner2=], ...)  [ATTACHMENTS];</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-teardrop">teardrop</a>(h|l=|height=|length=, r|d=, [ang=], [cap_h=], ...);</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-teardrop">teardrop</a>(h|l=|height=|length=, r1=|d1=, r2=|d2=, [ang=], [cap_h=], ...);</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-teardrop">teardrop</a>(h|l=|height=|length=, r1=|d1=, r2=|d2=, [ang=], [cap_h1=], [cap_h2=], ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-onion">onion</a>(r|d=, [ang=], [cap_h=], [circum=], [realign=], ...) [ATTACHMENTS];</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-onion">onion</a>(r|d=, [ang=], [cap_h=], [circum=], [realign=], ...);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Text</h3><a id="user-content-section-text-1" class="anchor" aria-label="Permalink: Section: Text" href="#section-text-1"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="shapes3d.scad#module-text3d">text3d</a>(text, [h], [size], [font], [language=], [script=], [direction=], [atype=], [anchor=], [spin=], [orient=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#module-path_text">path_text</a>(path, text, [size], [thickness], [font], [lettersize=], [offset=], [reverse=], [normal=], [top=], [textmetrics=], [kern=])</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Miscellaneous</h3><a id="user-content-section-miscellaneous" class="anchor" aria-label="Permalink: Section: Miscellaneous" href="#section-miscellaneous"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="shapes3d.scad#module-fillet">fillet</a>(l|h=|length=|height=, r|d=, [ang=], [excess=], [rounding=|chamfer=]) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#module-fillet">fillet</a>(l|h=|length=|height=, r1=|d1=, r2=|d2=, [ang=], [excess=], [rounding=|chamfer=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-plot3d">plot3d</a>(f, x, y, [zclip=], [zspan=], [base=], [convexity=], [style=]) [ATTACHMENTS];</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-plot3d">plot3d</a>(f, x, y, [zclip=], [zspan=], [base=], [style=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#functionmodule-plot_revolution">plot_revolution</a>(f, angle, z, [r=/d=] [r1=/d1], [r2=/d2=], [rclip=], [rspan=], [horiz=], [style=], [convexity=], ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-plot_revolution">plot_revolution</a>(f, arclength=, z=, [r=/d=] [r1=/d1], [r2=/d2=], [rclip=], [rspan=], [horiz=], [style=], [convexity=], ...) [ATTACHMENTS];</code><br>
<code><a href="shapes3d.scad#functionmodule-plot_revolution">plot_revolution</a>(f, [angle], [arclength=], path=, [rclip=], [rspan=], [horiz=], [style=], [convexity=], ...) [ATTACHMENTS];</code><br>
<code>vnf = <a href="shapes3d.scad#functionmodule-plot_revolution">plot_revolution</a>(...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="shapes3d.scad#module-ruler">ruler</a>(length, width, [thickness=], [depth=], [labels=], [pipscale=], [maxscale=], [colors=], [alpha=], [unit=], [inch=]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: masks.scad</h2><a id="user-content-libfile-masksscad" class="anchor" aria-label="Permalink: LibFile: masks.scad" href="#libfile-masksscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: 2D Masking Shapes</h3><a id="user-content-section-2d-masking-shapes" class="anchor" aria-label="Permalink: Section: 2D Masking Shapes" href="#section-2d-masking-shapes"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="masks.scad#functionmodule-mask2d_roundover">mask2d_roundover</a>(r|d=|h=|height=|cut=|joint=, [inset], [mask_angle], [excess], [flat_top=], [quarter_round=], [clip_angle=]) [ATTACHMENTS];</code><br>
<code>path = <a href="masks.scad#functionmodule-mask2d_roundover">mask2d_roundover</a>(r|d=|h=|height=|cut=|joint=, [inset], [mask_angle], [excess], [flat_top=], [quarter_round=], [clip_angle=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="masks.scad#functionmodule-mask2d_smooth">mask2d_smooth</a>([mask_angle], [cut=], [joint=], [inset=], [excess=], [flat_top=], [anchor=], [spin=]) [ATTACHMENTS];</code><br>
<code>path = <a href="masks.scad#functionmodule-mask2d_smooth">mask2d_smooth</a>([mask_angle], [cut=], [joint=], [inset=], [excess=], [flat_top=], [anchor=], [spin=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="masks.scad#functionmodule-mask2d_teardrop">mask2d_teardrop</a>(r|d=, [angle], [inset] [mask_angle], [excess], [cut=], [joint=], [h=|height=]) [ATTACHMENTS];</code><br>
<code>path = <a href="masks.scad#functionmodule-mask2d_teardrop">mask2d_teardrop</a>(r|d=, [angle], [inset], [mask_angle], [excess], [cut=], [joint=], [h=|height=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="masks.scad#functionmodule-mask2d_cove">mask2d_cove</a>(r|d=|h=|height=, [inset], [mask_angle], [excess], [bulge=], [flat_top=], [quarter_round=]) [ATTACHMENTS];</code><br>
<code>path = <a href="masks.scad#functionmodule-mask2d_cove">mask2d_cove</a>(r|d=|h=, [inset], [mask_angle], [excess], [bulge=], [flat_top=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="masks.scad#functionmodule-mask2d_chamfer">mask2d_chamfer</a>(edge, [angle], [inset], [excess]) [ATTACHMENTS];</code><br>
<code><a href="masks.scad#functionmodule-mask2d_chamfer">mask2d_chamfer</a>(y=, [angle=], [inset=], [excess=]) [ATTACHMENTS];</code><br>
<code><a href="masks.scad#functionmodule-mask2d_chamfer">mask2d_chamfer</a>(x=, [angle=], [inset=], [excess=]) [ATTACHMENTS];</code><br>
<code>path = <a href="masks.scad#functionmodule-mask2d_chamfer">mask2d_chamfer</a>(edge, [angle], [inset], [excess]);</code><br>
<code>path = <a href="masks.scad#functionmodule-mask2d_chamfer">mask2d_chamfer</a>(y=, [angle=], [inset=], [excess=]);</code><br>
<code>path = <a href="masks.scad#functionmodule-mask2d_chamfer">mask2d_chamfer</a>(x=, [angle=], [inset=], [excess=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="masks.scad#functionmodule-mask2d_rabbet">mask2d_rabbet</a>(size, [mask_angle], [excess]) [ATTACHMENTS];</code><br>
<code>path = <a href="masks.scad#functionmodule-mask2d_rabbet">mask2d_rabbet</a>(size, [mask_angle], [excess]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="masks.scad#functionmodule-mask2d_dovetail">mask2d_dovetail</a>(edge, angle, [inset], [shelf], [excess], ...) [ATTACHMENTS];</code><br>
<code><a href="masks.scad#functionmodule-mask2d_dovetail">mask2d_dovetail</a>(width=, angle=, [inset=], [shelf=], [excess=], ...) [ATTACHMENTS];</code><br>
<code><a href="masks.scad#functionmodule-mask2d_dovetail">mask2d_dovetail</a>(height=, angle=, [inset=], [shelf=], [excess=], ...) [ATTACHMENTS];</code><br>
<code><a href="masks.scad#functionmodule-mask2d_dovetail">mask2d_dovetail</a>(width=, height=, [inset=], [shelf=], [excess=], ...) [ATTACHMENTS];</code><br>
<code>path = <a href="masks.scad#functionmodule-mask2d_dovetail">mask2d_dovetail</a>(edge, [angle], [inset], [shelf], [excess]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="masks.scad#functionmodule-mask2d_ogee">mask2d_ogee</a>(pattern, [excess], ...) [ATTACHMENTS];</code><br>
<code>path = <a href="masks.scad#functionmodule-mask2d_ogee">mask2d_ogee</a>(pattern, [excess], ...);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Modules for Applying 2D Masks</h3><a id="user-content-section-modules-for-applying-2d-masks" class="anchor" aria-label="Permalink: Section: Modules for Applying 2D Masks" href="#section-modules-for-applying-2d-masks"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>PARENT() <a href="masks.scad#module-face_profile">face_profile</a>(faces, r|d=, [convexity=]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() <a href="masks.scad#module-edge_profile">edge_profile</a>([edges], [except], [convexity]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() edge_profile([edges], [except], [convexity=], [flip=], [corner_type=]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() <a href="masks.scad#module-corner_profile">corner_profile</a>([corners], [except], [r=|d=], [convexity=]) CHILDREN;</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: 3D Edge Masks</h3><a id="user-content-section-3d-edge-masks" class="anchor" aria-label="Permalink: Section: 3D Edge Masks" href="#section-3d-edge-masks"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="masks.scad#module-chamfer_edge_mask">chamfer_edge_mask</a>(l|h=|length=|height=, chamfer, [excess]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="masks.scad#module-rounding_edge_mask">rounding_edge_mask</a>(l|h=|length=|height=, r|d=, [ang], [excess=], [rounding=|chamfer=], ) [ATTACHMENTS];</code><br>
<code><a href="masks.scad#module-rounding_edge_mask">rounding_edge_mask</a>(l|h=|length=|height=, r1=|d1=, r2=|d2=, [ang=], [excess=], [rounding=|chamfer=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="masks.scad#module-teardrop_edge_mask">teardrop_edge_mask</a>(l|h=|length=|height=, r|d=, [angle], [excess], [anchor], [spin], [orient]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="masks.scad#module-polygon_edge_mask">polygon_edge_mask</a>(mask, l|h=|length=|height=, [scale=]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: 3D Masks for 90° Corners</h3><a id="user-content-section-3d-masks-for-90-corners" class="anchor" aria-label="Permalink: Section: 3D Masks for 90° Corners" href="#section-3d-masks-for-90-corners"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="masks.scad#module-chamfer_corner_mask">chamfer_corner_mask</a>(chamfer) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="masks.scad#module-rounding_corner_mask">rounding_corner_mask</a>(r|d, [ang], [excess=], [style=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="masks.scad#module-teardrop_corner_mask">teardrop_corner_mask</a>(r|d=, [angle], [excess], [anchor], [spin], [orient]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: 3D Cylinder End Masks</h3><a id="user-content-section-3d-cylinder-end-masks" class="anchor" aria-label="Permalink: Section: 3D Cylinder End Masks" href="#section-3d-cylinder-end-masks"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="masks.scad#module-chamfer_cylinder_mask">chamfer_cylinder_mask</a>(r|d=, chamfer, [ang], [from_end]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="masks.scad#module-rounding_cylinder_mask">rounding_cylinder_mask</a>(r|d=, rounding);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: 3D Cylindrical Hole Masks</h3><a id="user-content-section-3d-cylindrical-hole-masks" class="anchor" aria-label="Permalink: Section: 3D Cylindrical Hole Masks" href="#section-3d-cylindrical-hole-masks"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="masks.scad#module-rounding_hole_mask">rounding_hole_mask</a>(r|d, rounding, [excess]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Modules for Applying 3D Masks</h3><a id="user-content-section-modules-for-applying-3d-masks" class="anchor" aria-label="Permalink: Section: Modules for Applying 3D Masks" href="#section-modules-for-applying-3d-masks"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>PARENT() <a href="masks.scad#module-face_mask">face_mask</a>(faces) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() <a href="masks.scad#module-edge_mask">edge_mask</a>([edges], [except]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() <a href="masks.scad#module-corner_mask">corner_mask</a>([corners], [except]) CHILDREN;</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: drawing.scad</h2><a id="user-content-libfile-drawingscad" class="anchor" aria-label="Permalink: LibFile: drawing.scad" href="#libfile-drawingscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Line Drawing</h3><a id="user-content-section-line-drawing" class="anchor" aria-label="Permalink: Section: Line Drawing" href="#section-line-drawing"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="drawing.scad#module-stroke">stroke</a>(path, [width], [closed], [endcaps], [endcap_width], [endcap_length], [endcap_extent], [trim]);</code><br>
<code><a href="drawing.scad#module-stroke">stroke</a>(path, [width], [closed], [endcap1], [endcap2], [endcap_width1], [endcap_width2], [endcap_length1], [endcap_length2], [endcap_extent1], [endcap_extent2], [trim1], [trim2]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="drawing.scad#functionmodule-dashed_stroke">dashed_stroke</a>(path, dashpat, [width=], [closed=]);</code><br>
<code>dashes = <a href="drawing.scad#functionmodule-dashed_stroke">dashed_stroke</a>(path, dashpat, [closed=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Computing paths</h3><a id="user-content-section-computing-paths" class="anchor" aria-label="Permalink: Section: Computing paths" href="#section-computing-paths"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>path=<a href="drawing.scad#functionmodule-arc">arc</a>(n, r|d=, angle);</code>  &nbsp; &nbsp; <code>path=<a href="drawing.scad#functionmodule-arc">arc</a>(n, r|d=, angle=[START,END]);</code><br>
<code>path=<a href="drawing.scad#functionmodule-arc">arc</a>(n, r|d=, start=, angle=);</code>  &nbsp; &nbsp; <code>path=<a href="drawing.scad#functionmodule-arc">arc</a>(n, width=, thickness=);</code><br>
<code>path=<a href="drawing.scad#functionmodule-arc">arc</a>(n, cp=, points=[P0,P1], [long=], [cw=], [ccw=]);</code><br>
<code>path=<a href="drawing.scad#functionmodule-arc">arc</a>(n, points=[P0,P1,P2]);</code>  &nbsp; &nbsp; <code>path=<a href="drawing.scad#functionmodule-arc">arc</a>(n, corner=[P0,P1,P2], r=);</code><br>
<code>path=<a href="drawing.scad#functionmodule-arc">arc</a>(wedge=true,[rounding=],...)</code>  &nbsp; &nbsp; <code><a href="drawing.scad#functionmodule-arc">arc</a>(...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code>path = <a href="drawing.scad#function-catenary">catenary</a>(width, droop=|angle=, n=);</code></p>
</blockquote>
<blockquote>
<p><code>path = <a href="drawing.scad#function-helix">helix</a>(l|h, [turns=], [angle=], r=|r1=|r2=, d=|d1=|d2=);</code></p>
</blockquote>
<blockquote>
<p><code>path = <a href="drawing.scad#function-turtle">turtle</a>(commands, [state], [full_state=], [repeat=])</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Debugging polygons</h3><a id="user-content-section-debugging-polygons" class="anchor" aria-label="Permalink: Section: Debugging polygons" href="#section-debugging-polygons"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="drawing.scad#module-debug_polygon">debug_polygon</a>(points, paths, [vertices=], [edges=], [convexity=], [size=]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: distributors.scad</h2><a id="user-content-libfile-distributorsscad" class="anchor" aria-label="Permalink: LibFile: distributors.scad" href="#libfile-distributorsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Translating copies of all the children</h3><a id="user-content-section-translating-copies-of-all-the-children" class="anchor" aria-label="Permalink: Section: Translating copies of all the children" href="#section-translating-copies-of-all-the-children"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-move_copies">move_copies</a>(a) CHILDREN;</code>  &nbsp; &nbsp; <code>copies = <a href="distributors.scad#functionmodule-move_copies">move_copies</a>(a, p=);</code>  &nbsp; &nbsp; <code>mats = <a href="distributors.scad#functionmodule-move_copies">move_copies</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-xcopies">xcopies</a>(spacing, [n], [sp=]) CHILDREN;</code>  &nbsp; &nbsp; <code><a href="distributors.scad#functionmodule-xcopies">xcopies</a>(l=, [n=], [sp=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-xcopies">xcopies</a>(LIST) CHILDREN;</code><br>
<code>copies = <a href="distributors.scad#functionmodule-xcopies">xcopies</a>(spacing, [n], [sp=], p=);</code>  &nbsp; &nbsp; <code>copies = <a href="distributors.scad#functionmodule-xcopies">xcopies</a>(l=, [n=], [sp=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-xcopies">xcopies</a>(LIST, p=);</code>  &nbsp; &nbsp; <code>mats = <a href="distributors.scad#functionmodule-xcopies">xcopies</a>(spacing, [n], [sp=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-xcopies">xcopies</a>(l=, [n=], [sp=]);</code>  &nbsp; &nbsp; <code>mats = <a href="distributors.scad#functionmodule-xcopies">xcopies</a>(LIST);</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-ycopies">ycopies</a>(spacing, [n], [sp=]) CHILDREN;</code>  &nbsp; &nbsp; <code><a href="distributors.scad#functionmodule-ycopies">ycopies</a>(l=, [n=], [sp=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-ycopies">ycopies</a>(LIST) CHILDREN;</code><br>
<code>copies = <a href="distributors.scad#functionmodule-ycopies">ycopies</a>(spacing, [n], [sp=], p=);</code>  &nbsp; &nbsp; <code>copies = <a href="distributors.scad#functionmodule-ycopies">ycopies</a>(l=, [n=], [sp=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-ycopies">ycopies</a>(LIST, p=);</code>  &nbsp; &nbsp; <code>mats = <a href="distributors.scad#functionmodule-ycopies">ycopies</a>(spacing, [n], [sp=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-ycopies">ycopies</a>(l=, [n=], [sp=]);</code>  &nbsp; &nbsp; <code>mats = <a href="distributors.scad#functionmodule-ycopies">ycopies</a>(LIST);</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-zcopies">zcopies</a>(spacing, [n], [sp=]) CHILDREN;</code>  &nbsp; &nbsp; <code><a href="distributors.scad#functionmodule-zcopies">zcopies</a>(l=, [n=], [sp=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-zcopies">zcopies</a>(LIST) CHILDREN;</code><br>
<code>copies = <a href="distributors.scad#functionmodule-zcopies">zcopies</a>(spacing, [n], [sp=], p=);</code>  &nbsp; &nbsp; <code>copies = <a href="distributors.scad#functionmodule-zcopies">zcopies</a>(l=, [n=], [sp=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-zcopies">zcopies</a>(LIST, p=);</code>  &nbsp; &nbsp; <code>mats = <a href="distributors.scad#functionmodule-zcopies">zcopies</a>(spacing, [n], [sp=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-zcopies">zcopies</a>(l=, [n=], [sp=]);</code>  &nbsp; &nbsp; <code>mats = <a href="distributors.scad#functionmodule-zcopies">zcopies</a>(LIST);</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-line_copies">line_copies</a>(spacing, [n], [p1=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-line_copies">line_copies</a>(spacing, [l=], [p1=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-line_copies">line_copies</a>([n=], [l=], [p1=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-line_copies">line_copies</a>([n=], [p1=], [p2=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-line_copies">line_copies</a>([spacing], [p1=], [p2=]) CHILDREN;</code><br>
<code>copies = <a href="distributors.scad#functionmodule-line_copies">line_copies</a>([spacing], [n], [p1=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-line_copies">line_copies</a>([spacing], [l=], [p1=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-line_copies">line_copies</a>([n=], [l=], [p1=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-line_copies">line_copies</a>([n=], [p1=], [p2=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-line_copies">line_copies</a>([spacing], [p1=], [p2=], p=);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-line_copies">line_copies</a>([spacing], [n], [p1=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-line_copies">line_copies</a>([spacing], [l=], [p1=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-line_copies">line_copies</a>([n=], [l=], [p1=]);</code>  &nbsp; &nbsp; <code>mats = <a href="distributors.scad#functionmodule-line_copies">line_copies</a>([n=], [p1=], [p2=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-line_copies">line_copies</a>([spacing], [p1=], [p2=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-grid_copies">grid_copies</a>(spacing, size=, [stagger=], [scale=], [inside=], [axes=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-grid_copies">grid_copies</a>(n=, size=, [stagger=], [scale=], [inside=], [axes=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-grid_copies">grid_copies</a>(spacing, [n], [stagger=], [scale=], [inside=], [axes=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-grid_copies">grid_copies</a>(n=, inside=, [stagger], [scale], [axes=]) CHILDREN;</code><br>
<code>copies = <a href="distributors.scad#functionmodule-grid_copies">grid_copies</a>(spacing, size=, [stagger=], [scale=], [inside=], [axes=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-grid_copies">grid_copies</a>(n=, size=, [stagger=], [scale=], [inside=], [axes=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-grid_copies">grid_copies</a>(spacing, [n], [stagger=], [scale=], [inside=], [axes=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-grid_copies">grid_copies</a>(n=, inside=, [stagger], [scale], [axes=], p=);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-grid_copies">grid_copies</a>(spacing, size=, [stagger=], [scale=], [inside=], [axes=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-grid_copies">grid_copies</a>(n=, size=, [stagger=], [scale=], [inside=], [axes=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-grid_copies">grid_copies</a>(spacing, [n], [stagger=], [scale=], [inside=], [axes=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-grid_copies">grid_copies</a>(n=, inside=, [stagger], [scale], [axes=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Rotating copies of all children</h3><a id="user-content-section-rotating-copies-of-all-children" class="anchor" aria-label="Permalink: Section: Rotating copies of all children" href="#section-rotating-copies-of-all-children"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-rot_copies">rot_copies</a>(rots, [cp=], [sa=], [delta=], [subrot=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-rot_copies">rot_copies</a>(rots, v, [cp=], [sa=], [delta=], [subrot=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-rot_copies">rot_copies</a>(n=, [v=], [cp=], [sa=], [delta=], [subrot=]) CHILDREN;</code><br>
<code>copies = <a href="distributors.scad#functionmodule-rot_copies">rot_copies</a>(rots, [cp=], [sa=], [delta=], [subrot=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-rot_copies">rot_copies</a>(rots, v, [cp=], [sa=], [delta=], [subrot=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-rot_copies">rot_copies</a>(n=, [v=], [cp=], [sa=], [delta=], [subrot=], p=);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-rot_copies">rot_copies</a>(rots, [cp=], [sa=], [delta=], [subrot=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-rot_copies">rot_copies</a>(rots, v, [cp=], [sa=], [delta=], [subrot=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-rot_copies">rot_copies</a>(n=, [v=], [cp=], [sa=], [delta=], [subrot=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-xrot_copies">xrot_copies</a>(rots, [cp], [r=|d=], [sa=], [subrot=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-xrot_copies">xrot_copies</a>(n=, [cp=], [r=|d=], [sa=], [subrot=]) CHILDREN;</code><br>
<code>copies = <a href="distributors.scad#functionmodule-xrot_copies">xrot_copies</a>(rots, [cp], [r=|d=], [sa=], [subrot=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-xrot_copies">xrot_copies</a>(n=, [cp=], [r=|d=], [sa=], [subrot=], p=);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-xrot_copies">xrot_copies</a>(rots, [cp], [r=|d=], [sa=], [subrot=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-xrot_copies">xrot_copies</a>(n=, [cp=], [r=|d=], [sa=], [subrot=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-yrot_copies">yrot_copies</a>(rots, [cp], [r=|d=], [sa=], [subrot=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-yrot_copies">yrot_copies</a>(n=, [cp=], [r=|d=], [sa=], [subrot=]) CHILDREN;</code><br>
<code>copies = <a href="distributors.scad#functionmodule-yrot_copies">yrot_copies</a>(rots, [cp], [r=|d=], [sa=], [subrot=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-yrot_copies">yrot_copies</a>(n=, [cp=], [r=|d=], [sa=], [subrot=], p=);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-yrot_copies">yrot_copies</a>(rots, [cp], [r=|d=], [sa=], [subrot=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-yrot_copies">yrot_copies</a>(n=, [cp=], [r=|d=], [sa=], [subrot=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-zrot_copies">zrot_copies</a>(rots, [cp], [r=|d=], [sa=], [subrot=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-zrot_copies">zrot_copies</a>(n=, [cp=], [r=|d=], [sa=], [subrot=]) CHILDREN;</code><br>
<code>copies = <a href="distributors.scad#functionmodule-zrot_copies">zrot_copies</a>(rots, [cp], [r=|d=], [sa=], [subrot=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-zrot_copies">zrot_copies</a>(n=, [cp=], [r=|d=], [sa=], [subrot=], p=);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-zrot_copies">zrot_copies</a>(rots, [cp], [r=|d=], [sa=], [subrot=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-zrot_copies">zrot_copies</a>(n=, [cp=], [r=|d=], [sa=], [subrot=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-arc_copies">arc_copies</a>(n, r|d=, [sa=], [ea=], [rot=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-arc_copies">arc_copies</a>(n, rx=|dx=, ry=|dy=, [sa=], [ea=], [rot=]) CHILDREN;</code><br>
<code>copies = <a href="distributors.scad#functionmodule-arc_copies">arc_copies</a>(n, r|d=, [sa=], [ea=], [rot=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-arc_copies">arc_copies</a>(n, rx=|dx=, ry=|dy=, [sa=], [ea=], [rot=], p=);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-arc_copies">arc_copies</a>(n, r|d=, [sa=], [ea=], [rot=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-arc_copies">arc_copies</a>(n, rx=|dx=, ry=|dy=, [sa=], [ea=], [rot=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-sphere_copies">sphere_copies</a>(n, r|d=, [cone_ang=], [scale=], [perp=]) CHILDREN;</code><br>
<code>copies = <a href="distributors.scad#functionmodule-sphere_copies">sphere_copies</a>(n, r|d=, [cone_ang=], [scale=], [perp=], p=);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-sphere_copies">sphere_copies</a>(n, r|d=, [cone_ang=], [scale=], [perp=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Placing copies of all children on a path</h3><a id="user-content-section-placing-copies-of-all-children-on-a-path" class="anchor" aria-label="Permalink: Section: Placing copies of all children on a path" href="#section-placing-copies-of-all-children-on-a-path"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-path_copies">path_copies</a>(path, [n], [spacing], [sp], [rotate_children], [closed=]) CHILDREN;</code><br>
<code><a href="distributors.scad#functionmodule-path_copies">path_copies</a>(path, dist=, [rotate_children=], [closed=]) CHILDREN;</code><br>
<code>copies = <a href="distributors.scad#functionmodule-path_copies">path_copies</a>(path, [n], [spacing], [sp], [rotate_children], [closed=], p=);</code><br>
<code>copies = <a href="distributors.scad#functionmodule-path_copies">path_copies</a>(path, dist=, [rotate_children=], [closed=], p=);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-path_copies">path_copies</a>(path, [n], [spacing], [sp], [rotate_children], [closed=]);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-path_copies">path_copies</a>(path, dist=, [rotate_children=], [closed=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Making a copy of all children with reflection</h3><a id="user-content-section-making-a-copy-of-all-children-with-reflection" class="anchor" aria-label="Permalink: Section: Making a copy of all children with reflection" href="#section-making-a-copy-of-all-children-with-reflection"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-xflip_copy">xflip_copy</a>([offset], [x]) CHILDREN;</code>  &nbsp; &nbsp; <code>copies = <a href="distributors.scad#functionmodule-xflip_copy">xflip_copy</a>([offset], [x], p=);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-xflip_copy">xflip_copy</a>([offset], [x]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-yflip_copy">yflip_copy</a>([offset], [y]) CHILDREN;</code>  &nbsp; &nbsp; <code>copies = <a href="distributors.scad#functionmodule-yflip_copy">yflip_copy</a>([offset], [y], p=);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-yflip_copy">yflip_copy</a>([offset], [y]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-zflip_copy">zflip_copy</a>([offset], [z]) CHILDREN;</code>  &nbsp; &nbsp; <code>copies = <a href="distributors.scad#functionmodule-zflip_copy">zflip_copy</a>([offset], [z], p=);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-zflip_copy">zflip_copy</a>([offset], [z]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#functionmodule-mirror_copy">mirror_copy</a>(v, [cp], [offset]) CHILDREN;</code><br>
<code>copies = <a href="distributors.scad#functionmodule-mirror_copy">mirror_copy</a>(v, [cp], [offset], p=);</code><br>
<code>mats = <a href="distributors.scad#functionmodule-mirror_copy">mirror_copy</a>(v, [cp], [offset]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Distributing children individually along a line</h3><a id="user-content-section-distributing-children-individually-along-a-line" class="anchor" aria-label="Permalink: Section: Distributing children individually along a line" href="#section-distributing-children-individually-along-a-line"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="distributors.scad#module-xdistribute">xdistribute</a>(spacing, [sizes]) CHILDREN;</code>  &nbsp; &nbsp; <code><a href="distributors.scad#module-xdistribute">xdistribute</a>(l=, [sizes=]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#module-ydistribute">ydistribute</a>(spacing, [sizes]) CHILDREN;</code>  &nbsp; &nbsp; <code><a href="distributors.scad#module-ydistribute">ydistribute</a>(l=, [sizes=]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#module-zdistribute">zdistribute</a>(spacing, [sizes]) CHILDREN;</code>  &nbsp; &nbsp; <code><a href="distributors.scad#module-zdistribute">zdistribute</a>(l=, [sizes=]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="distributors.scad#module-distribute">distribute</a>(spacing, sizes, dir) CHILDREN;</code><br>
<code><a href="distributors.scad#module-distribute">distribute</a>(l=, [sizes=], [dir=]) CHILDREN;</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: color.scad</h2><a id="user-content-libfile-colorscad" class="anchor" aria-label="Permalink: LibFile: color.scad" href="#libfile-colorscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Coloring Objects</h3><a id="user-content-section-coloring-objects" class="anchor" aria-label="Permalink: Section: Coloring Objects" href="#section-coloring-objects"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="color.scad#module-recolor">recolor</a>([c]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="color.scad#module-color_this">color_this</a>([c]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="color.scad#module-rainbow">rainbow</a>(list,[stride],[maxhues],[shuffle],[seed]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="color.scad#module-color_overlaps">color_overlaps</a>([color]) CHILDREN;</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Setting Object Modifiers</h3><a id="user-content-section-setting-object-modifiers" class="anchor" aria-label="Permalink: Section: Setting Object Modifiers" href="#section-setting-object-modifiers"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="color.scad#module-highlight">highlight</a>([<a href="color.scad#module-highlight">highlight</a>]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="color.scad#module-highlight_this">highlight_this</a>() CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="color.scad#module-ghost">ghost</a>([<a href="color.scad#module-ghost">ghost</a>]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="color.scad#module-ghost_this">ghost_this</a>() CHILDREN;</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Colorspace Conversion</h3><a id="user-content-section-colorspace-conversion" class="anchor" aria-label="Permalink: Section: Colorspace Conversion" href="#section-colorspace-conversion"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="color.scad#functionmodule-hsl">hsl</a>(h,[s],[l],[a]) CHILDREN;</code>  &nbsp; &nbsp; <code>rgb = <a href="color.scad#functionmodule-hsl">hsl</a>(h,[s],[l],[a]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="color.scad#functionmodule-hsv">hsv</a>(h,[s],[v],[a]) CHILDREN;</code>  &nbsp; &nbsp; <code>rgb = <a href="color.scad#functionmodule-hsv">hsv</a>(h,[s],[v],[a]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: partitions.scad</h2><a id="user-content-libfile-partitionsscad" class="anchor" aria-label="Permalink: LibFile: partitions.scad" href="#libfile-partitionsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Planar Cutting</h3><a id="user-content-section-planar-cutting" class="anchor" aria-label="Permalink: Section: Planar Cutting" href="#section-planar-cutting"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="partitions.scad#functionmodule-half_of">half_of</a>(v, [cp], [s], [planar]) CHILDREN;</code>  &nbsp; &nbsp; <code>result = <a href="partitions.scad#functionmodule-half_of">half_of</a>(p,v,[cp]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="partitions.scad#functionmodule-left_half">left_half</a>([s], [x]) CHILDREN;</code><br>
<code><a href="partitions.scad#functionmodule-left_half">left_half</a>(planar=true, [s], [x]) CHILDREN;</code>  &nbsp; &nbsp; <code>result = <a href="partitions.scad#functionmodule-left_half">left_half</a>(p, [x]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="partitions.scad#functionmodule-right_half">right_half</a>([s=], [x=]) CHILDREN;</code><br>
<code><a href="partitions.scad#functionmodule-right_half">right_half</a>(planar=true, [s=], [x=]) CHILDREN;</code>  &nbsp; &nbsp; <code>result = <a href="partitions.scad#functionmodule-right_half">right_half</a>(p, [x=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="partitions.scad#functionmodule-front_half">front_half</a>([s], [y]) CHILDREN;</code><br>
<code><a href="partitions.scad#functionmodule-front_half">front_half</a>(planar=true, [s], [y]) CHILDREN;</code>  &nbsp; &nbsp; <code>result = <a href="partitions.scad#functionmodule-front_half">front_half</a>(p, [y]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="partitions.scad#functionmodule-back_half">back_half</a>([s], [y]) CHILDREN;</code><br>
<code><a href="partitions.scad#functionmodule-back_half">back_half</a>(planar=true, [s], [y]) CHILDREN;</code>  &nbsp; &nbsp; <code>result = <a href="partitions.scad#functionmodule-back_half">back_half</a>(p, [y]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="partitions.scad#functionmodule-bottom_half">bottom_half</a>([s], [z]) CHILDREN;</code>  &nbsp; &nbsp; <code>result = <a href="partitions.scad#functionmodule-bottom_half">bottom_half</a>(p, [z]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="partitions.scad#functionmodule-top_half">top_half</a>([s], [z]) CHILDREN;</code>  &nbsp; &nbsp; <code>result = <a href="partitions.scad#functionmodule-top_half">top_half</a>(p, [z]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Partioning into Interlocking Pieces</h3><a id="user-content-section-partioning-into-interlocking-pieces" class="anchor" aria-label="Permalink: Section: Partioning into Interlocking Pieces" href="#section-partioning-into-interlocking-pieces"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="partitions.scad#module-partition_mask">partition_mask</a>(l, w, h, [cutsize], [cutpath], [gap], [inverse], [$slop=], [anchor=], [spin=], [orient=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="partitions.scad#module-partition_cut_mask">partition_cut_mask</a>(l, [cutsize], [cutpath], [gap], [inverse], [$slop=], [anchor=], [spin=], [orient=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="partitions.scad#module-partition">partition</a>(size, [spread], [cutsize], [cutpath], [gap], [spin], [$slop=]) CHILDREN;</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: miscellaneous.scad</h2><a id="user-content-libfile-miscellaneousscad" class="anchor" aria-label="Permalink: LibFile: miscellaneous.scad" href="#libfile-miscellaneousscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Extrusion</h3><a id="user-content-section-extrusion" class="anchor" aria-label="Permalink: Section: Extrusion" href="#section-extrusion"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="miscellaneous.scad#module-extrude_from_to">extrude_from_to</a>(pt1, pt2, [convexity=], [twist=], [scale=], [slices=]) 2D-CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="miscellaneous.scad#module-path_extrude2d">path_extrude2d</a>(path, [caps=], [closed=], [s=], [convexity=]) 2D-CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="miscellaneous.scad#module-path_extrude">path_extrude</a>(path, [convexity], [clipsize]) 2D-CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="miscellaneous.scad#module-cylindrical_extrude">cylindrical_extrude</a>(ir|id=, or|od=, [size=], [convexity=], [spin=], [orient=]) 2D-CHILDREN;</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Bounding Box</h3><a id="user-content-section-bounding-box" class="anchor" aria-label="Permalink: Section: Bounding Box" href="#section-bounding-box"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="miscellaneous.scad#module-bounding_box">bounding_box</a>([excess],[planar]) CHILDREN;</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Hull Based Modules</h3><a id="user-content-section-hull-based-modules" class="anchor" aria-label="Permalink: Section: Hull Based Modules" href="#section-hull-based-modules"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="miscellaneous.scad#module-chain_hull">chain_hull</a>() CHILDREN;</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Minkowski and 3D Offset</h3><a id="user-content-section-minkowski-and-3d-offset" class="anchor" aria-label="Permalink: Section: Minkowski and 3D Offset" href="#section-minkowski-and-3d-offset"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="miscellaneous.scad#module-minkowski_difference">minkowski_difference</a>() { BASE; DIFF1; DIFF2; ... }</code></p>
</blockquote>
<blockquote>
<p><code><a href="miscellaneous.scad#module-offset3d">offset3d</a>(r, [size], [convexity]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="miscellaneous.scad#module-round3d">round3d</a>(r) CHILDREN;</code>  &nbsp; &nbsp; <code><a href="miscellaneous.scad#module-round3d">round3d</a>(or) CHILDREN;</code>  &nbsp; &nbsp; <code><a href="miscellaneous.scad#module-round3d">round3d</a>(ir) CHILDREN;</code><br>
<code><a href="miscellaneous.scad#module-round3d">round3d</a>(or, ir) CHILDREN;</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: paths.scad</h2><a id="user-content-libfile-pathsscad" class="anchor" aria-label="Permalink: LibFile: paths.scad" href="#libfile-pathsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Utility Functions</h3><a id="user-content-section-utility-functions" class="anchor" aria-label="Permalink: Section: Utility Functions" href="#section-utility-functions"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="paths.scad#function-is_path">is_path</a>(list, [dim], [fast])</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="paths.scad#function-is_1region">is_1region</a>(path, [name])</code></p>
</blockquote>
<blockquote>
<p><code>outpath = <a href="paths.scad#function-force_path">force_path</a>(path, [name])</code></p>
</blockquote>
<blockquote>
<p><code>newpath = <a href="paths.scad#function-path_merge_collinear">path_merge_collinear</a>(path, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>ind = path_merge_collinear(path, [eps]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Path length calculation</h3><a id="user-content-section-path-length-calculation" class="anchor" aria-label="Permalink: Section: Path length calculation" href="#section-path-length-calculation"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="paths.scad#function-path_length">path_length</a>(path,[closed])</code></p>
</blockquote>
<blockquote>
<p><code><a href="paths.scad#function-path_segment_lengths">path_segment_lengths</a>(path,[closed])</code></p>
</blockquote>
<blockquote>
<p><code>fracs = <a href="paths.scad#function-path_length_fractions">path_length_fractions</a>(path, [closed]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Resampling - changing the number of points in a path</h3><a id="user-content-section-resampling---changing-the-number-of-points-in-a-path" class="anchor" aria-label="Permalink: Section: Resampling - changing the number of points in a path" href="#section-resampling---changing-the-number-of-points-in-a-path"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>newpath = <a href="paths.scad#function-subdivide_path">subdivide_path</a>(path, n|refine=|maxlen=, [method=], [closed=], [exact=]);</code></p>
</blockquote>
<blockquote>
<p><code>newpath = <a href="paths.scad#function-resample_path">resample_path</a>(path, n|spacing=, [closed=]);</code></p>
</blockquote>
<blockquote>
<p><code>newpath = <a href="paths.scad#function-simplify_path">simplify_path</a>(path, maxerr, [closed=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Path Geometry</h3><a id="user-content-section-path-geometry" class="anchor" aria-label="Permalink: Section: Path Geometry" href="#section-path-geometry"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>bool = <a href="paths.scad#function-is_path_simple">is_path_simple</a>(path, [closed], [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>index_pt = <a href="paths.scad#function-path_closest_point">path_closest_point</a>(path, pt);</code></p>
</blockquote>
<blockquote>
<p><code>tangs = <a href="paths.scad#function-path_tangents">path_tangents</a>(path, [closed], [uniform]);</code></p>
</blockquote>
<blockquote>
<p><code>norms = <a href="paths.scad#function-path_normals">path_normals</a>(path, [tangents], [closed]);</code></p>
</blockquote>
<blockquote>
<p><code>curvs = <a href="paths.scad#function-path_curvature">path_curvature</a>(path, [closed]);</code></p>
</blockquote>
<blockquote>
<p><code>torsions = <a href="paths.scad#function-path_torsion">path_torsion</a>(path, [closed]);</code></p>
</blockquote>
<blockquote>
<p><code>normals = <a href="paths.scad#function-surface_normals">surface_normals</a>(surf, [col_wrap=], [row_wrap=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Breaking paths up into subpaths</h3><a id="user-content-section-breaking-paths-up-into-subpaths" class="anchor" aria-label="Permalink: Section: Breaking paths up into subpaths" href="#section-breaking-paths-up-into-subpaths"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>path_list = <a href="paths.scad#function-path_cut">path_cut</a>(path, cutdist, [closed]);</code></p>
</blockquote>
<blockquote>
<p><code>cuts = <a href="paths.scad#function-path_cut_points">path_cut_points</a>(path, cutdist, [closed=], [direction=]);</code></p>
</blockquote>
<blockquote>
<p><code>paths = <a href="paths.scad#function-split_path_at_self_crossings">split_path_at_self_crossings</a>(path, [closed], [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>splitpolys = <a href="paths.scad#function-polygon_parts">polygon_parts</a>(poly, [nonzero], [eps]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: regions.scad</h2><a id="user-content-libfile-regionsscad" class="anchor" aria-label="Permalink: LibFile: regions.scad" href="#libfile-regionsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Regions</h3><a id="user-content-section-regions" class="anchor" aria-label="Permalink: Section: Regions" href="#section-regions"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>bool = <a href="regions.scad#function-is_region">is_region</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="regions.scad#function-is_valid_region">is_valid_region</a>(region, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="regions.scad#function-is_region_simple">is_region_simple</a>(region, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>region = <a href="regions.scad#function-make_region">make_region</a>(polys, [nonzero], [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>region = <a href="regions.scad#function-force_region">force_region</a>(poly)</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Turning a region into geometry</h3><a id="user-content-section-turning-a-region-into-geometry" class="anchor" aria-label="Permalink: Section: Turning a region into geometry" href="#section-turning-a-region-into-geometry"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="regions.scad#module-region">region</a>(r, [anchor], [spin=], [cp=], [atype=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="regions.scad#module-debug_region">debug_region</a>(region, [vertices=], [edges=], [convexity=], [size=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Geometrical calculations with regions</h3><a id="user-content-section-geometrical-calculations-with-regions" class="anchor" aria-label="Permalink: Section: Geometrical calculations with regions" href="#section-geometrical-calculations-with-regions"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>check = <a href="regions.scad#function-point_in_region">point_in_region</a>(point, region, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>area = <a href="regions.scad#function-region_area">region_area</a>(region);</code></p>
</blockquote>
<blockquote>
<p><code>b = <a href="regions.scad#function-are_regions_equal">are_regions_equal</a>(region1, region2, [either_winding])</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Breaking up regions into subregions</h3><a id="user-content-section-breaking-up-regions-into-subregions" class="anchor" aria-label="Permalink: Section: Breaking up regions into subregions" href="#section-breaking-up-regions-into-subregions"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>split_region = <a href="regions.scad#function-split_region_at_region_crossings">split_region_at_region_crossings</a>(region1, region2, [closed1], [closed2], [eps])</code></p>
</blockquote>
<blockquote>
<p><code>rgns = <a href="regions.scad#function-region_parts">region_parts</a>(region);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Offset and 2D Boolean Set Operations</h3><a id="user-content-section-offset-and-2d-boolean-set-operations" class="anchor" aria-label="Permalink: Section: Offset and 2D Boolean Set Operations" href="#section-offset-and-2d-boolean-set-operations"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="regions.scad#function-offset">offset</a>path = <a href="regions.scad#function-offset">offset</a>(path, [r=|delta=], [chamfer=], [closed=], [check_valid=], [quality=], [error=], [same_length=])</code><br>
<code>path_faces = <a href="regions.scad#function-offset">offset</a>(path, return_faces=true, [r=|delta=], [chamfer=], [closed=], [check_valid=], [quality=], [error=], [firstface_index=], [flip_faces=])</code></p>
</blockquote>
<blockquote>
<p><code><a href="regions.scad#functionmodule-union">union</a>() CHILDREN;</code>  &nbsp; &nbsp; <code>region = <a href="regions.scad#functionmodule-union">union</a>(regions);</code>  &nbsp; &nbsp; <code>region = <a href="regions.scad#functionmodule-union">union</a>(REGION1,REGION2);</code><br>
<code>region = <a href="regions.scad#functionmodule-union">union</a>(REGION1,REGION2,REGION3);</code></p>
</blockquote>
<blockquote>
<p><code><a href="regions.scad#functionmodule-difference">difference</a>() CHILDREN;</code>  &nbsp; &nbsp; <code>region = <a href="regions.scad#functionmodule-difference">difference</a>(regions);</code><br>
<code>region = <a href="regions.scad#functionmodule-difference">difference</a>(REGION1,REGION2);</code><br>
<code>region = <a href="regions.scad#functionmodule-difference">difference</a>(REGION1,REGION2,REGION3);</code></p>
</blockquote>
<blockquote>
<p><code><a href="regions.scad#functionmodule-intersection">intersection</a>() CHILDREN;</code>  &nbsp; &nbsp; <code>region = <a href="regions.scad#functionmodule-intersection">intersection</a>(regions);</code><br>
<code>region = <a href="regions.scad#functionmodule-intersection">intersection</a>(REGION1,REGION2);</code><br>
<code>region = <a href="regions.scad#functionmodule-intersection">intersection</a>(REGION1,REGION2,REGION3);</code></p>
</blockquote>
<blockquote>
<p><code><a href="regions.scad#functionmodule-exclusive_or">exclusive_or</a>() CHILDREN;</code>  &nbsp; &nbsp; <code>region = <a href="regions.scad#functionmodule-exclusive_or">exclusive_or</a>(regions);</code><br>
<code>region = <a href="regions.scad#functionmodule-exclusive_or">exclusive_or</a>(REGION1,REGION2);</code><br>
<code>region = <a href="regions.scad#functionmodule-exclusive_or">exclusive_or</a>(REGION1,REGION2,REGION3);</code></p>
</blockquote>
<blockquote>
<p><code>path = <a href="regions.scad#functionmodule-hull_region">hull_region</a>(region);</code>  &nbsp; &nbsp; <code><a href="regions.scad#functionmodule-hull_region">hull_region</a>(region);</code></p>
</blockquote>
<blockquote>
<p><code><a href="regions.scad#function-fill">fill</a>ed = <a href="regions.scad#function-fill">fill</a>(region);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: skin.scad</h2><a id="user-content-libfile-skinscad" class="anchor" aria-label="Permalink: LibFile: skin.scad" href="#libfile-skinscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Skin and sweep</h3><a id="user-content-section-skin-and-sweep" class="anchor" aria-label="Permalink: Section: Skin and sweep" href="#section-skin-and-sweep"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="skin.scad#functionmodule-skin">skin</a>(profiles, slices, [z=], [refine=], [method=], [sampling=], [caps=], [closed=], [style=], [convexity=], [anchor=],[cp=],[spin=],[orient=],[atype=]) [ATTACHMENTS];</code><br>
<code>vnf = <a href="skin.scad#functionmodule-skin">skin</a>(profiles, slices, [z=], [refine=], [method=], [sampling=], [caps=], [closed=], [style=], [anchor=],[cp=],[spin=],[orient=],[atype=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="skin.scad#functionmodule-linear_sweep">linear_sweep</a>(region, [height], [center=], [slices=], [twist=], [scale=], [style=], [caps=], [convexity=]) [ATTACHMENTS];</code><br>
<code><a href="skin.scad#functionmodule-linear_sweep">linear_sweep</a>(region, [height], [center=], texture=, [tex_size=]|[tex_reps=], [tex_depth=], [style=], [tex_samples=], ...) [ATTACHMENTS];</code><br>
<code>vnf = <a href="skin.scad#functionmodule-linear_sweep">linear_sweep</a>(region, [height], [center=], [slices=], [twist=], [scale=], [style=], [caps=]);</code><br>
<code>vnf = <a href="skin.scad#functionmodule-linear_sweep">linear_sweep</a>(region, [height], [center=], texture=, [tex_size=]|[tex_reps=], [tex_depth=], [style=], [tex_samples=], ...);</code></p>
</blockquote>
<blockquote>
<p><code>vnf = <a href="skin.scad#functionmodule-rotate_sweep">rotate_sweep</a>(shape, [angle], ...);</code><br>
<code><a href="skin.scad#functionmodule-rotate_sweep">rotate_sweep</a>(shape, [angle], ...) [ATTACHMENTS];</code><br>
<code><a href="skin.scad#functionmodule-rotate_sweep">rotate_sweep</a>(shape, texture=, [tex_size=]|[tex_reps=], [tex_depth=], [tex_samples=], [tex_rot=], [tex_inset=], ...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="skin.scad#functionmodule-spiral_sweep">spiral_sweep</a>(poly, h, r|d=, turns, [taper=], [center=], [taper1=], [taper2=], [internal=], ...)[ATTACHMENTS];</code><br>
<code><a href="skin.scad#functionmodule-spiral_sweep">spiral_sweep</a>(poly, h, r1=|d1=, r2=|d2=, turns, [taper=], [center=], [taper1=], [taper2=], [internal=], ...)[ATTACHMENTS];</code><br>
<code>vnf = <a href="skin.scad#functionmodule-spiral_sweep">spiral_sweep</a>(poly, h, r|d=, turns, ...);</code><br>
<code>vnf = <a href="skin.scad#functionmodule-spiral_sweep">spiral_sweep</a>(poly, h, r1=|d1=, r1=|d2=, turns, ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="skin.scad#functionmodule-path_sweep">path_sweep</a>(shape, path, [method], [normal=], [closed=], [twist=], [twist_by_length=], [symmetry=], [scale=], [scale_by_length=], [last_normal=], [tangent=], [uniform=], [relaxed=], [caps=], [style=], [convexity=], [anchor=], [cp=], [spin=], [orient=], [atype=]) [ATTACHMENTS];</code><br>
<code>vnf = <a href="skin.scad#functionmodule-path_sweep">path_sweep</a>(shape, path, [method], [normal=], [closed=], [twist=], [twist_by_length=], [symmetry=], [scale=], [scale_by_length=], [last_normal=], [tangent=], [uniform=], [relaxed=], [caps=], [style=], [transforms=], [anchor=], [cp=], [spin=], [orient=], [atype=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="skin.scad#functionmodule-path_sweep2d">path_sweep2d</a>(shape, path, [closed], [caps], [quality], [style], [convexity=], [anchor=], [spin=], [orient=], [atype=], [cp=]) [ATTACHMENTS];</code><br>
<code>vnf = <a href="skin.scad#functionmodule-path_sweep2d">path_sweep2d</a>(shape, path, [closed], [caps], [quality], [style], [anchor=], [spin=], [orient=], [atype=], [cp=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="skin.scad#functionmodule-sweep">sweep</a>(shape, transforms, [closed], [caps], [style], [convexity=], [anchor=], [spin=], [orient=], [atype=]) [ATTACHMENTS];</code><br>
<code>vnf = <a href="skin.scad#functionmodule-sweep">sweep</a>(shape, transforms, [closed], [caps], [style], [anchor=], [spin=], [orient=], [atype=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Attaching children to sweeps</h3><a id="user-content-section-attaching-children-to-sweeps" class="anchor" aria-label="Permalink: Section: Attaching children to sweeps" href="#section-attaching-children-to-sweeps"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>path_sweep(...) { <a href="skin.scad#module-sweep_attach">sweep_attach</a>(parent, [child], [frac], [idx=], [len=], [spin=], [overlap=], [atype=]) CHILDREN; }</code><br>
<code>sweep(...) { <a href="skin.scad#module-sweep_attach">sweep_attach</a>(parent, [child], [frac], [idx=], [len=], [spin=], [overlap=], [atype=]) CHILDREN; }</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Functions for resampling and slicing profile lists</h3><a id="user-content-section-functions-for-resampling-and-slicing-profile-lists" class="anchor" aria-label="Permalink: Section: Functions for resampling and slicing profile lists" href="#section-functions-for-resampling-and-slicing-profile-lists"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>newprof = <a href="skin.scad#function-subdivide_and_slice">subdivide_and_slice</a>(profiles, slices, [numpoints], [method], [closed]);</code></p>
</blockquote>
<blockquote>
<p><code>profs = <a href="skin.scad#function-slice_profiles">slice_profiles</a>(profiles, slices, [closed]);</code></p>
</blockquote>
<blockquote>
<p><code>rlist = <a href="skin.scad#function-rot_resample">rot_resample</a>(rotlist, n, [method=], [twist=], [scale=], [smoothlen=], [long=], [turns=], [closed=])</code></p>
</blockquote>
<blockquote>
<p><code>newpoly = <a href="skin.scad#function-associate_vertices">associate_vertices</a>(polygons, split);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Texturing</h3><a id="user-content-section-texturing" class="anchor" aria-label="Permalink: Section: Texturing" href="#section-texturing"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>tx = <a href="skin.scad#function-texture">texture</a>(tex, [n=], [inset=], [gap=], [roughness=]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: vnf.scad</h2><a id="user-content-libfile-vnfscad" class="anchor" aria-label="Permalink: LibFile: vnf.scad" href="#libfile-vnfscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Creating Polyhedrons with VNF Structures</h3><a id="user-content-section-creating-polyhedrons-with-vnf-structures" class="anchor" aria-label="Permalink: Section: Creating Polyhedrons with VNF Structures" href="#section-creating-polyhedrons-with-vnf-structures"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>vnf = <a href="vnf.scad#functionmodule-vnf_vertex_array">vnf_vertex_array</a>(points, [caps=], [cap1=], [cap2=], [style=], [reverse=], [col_wrap=], [row_wrap=], [triangulate=]);</code><br>
<code><a href="vnf.scad#functionmodule-vnf_vertex_array">vnf_vertex_array</a>(points, [caps=], [cap1=], [cap2=], [style=], [reverse=], [col_wrap=], [row_wrap=], [triangulate=],...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code>vnf = <a href="vnf.scad#functionmodule-vnf_tri_array">vnf_tri_array</a>(points, [caps=], [cap1=], [cap2=], [reverse=], [col_wrap=], [row_wrap=], [limit_bunching=])</code><br>
<code><a href="vnf.scad#functionmodule-vnf_tri_array">vnf_tri_array</a>(points, [caps=], [cap1=], [cap2=], [reverse=], [col_wrap=], [row_wrap=], [limit_bunching=],...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code>vnf = <a href="vnf.scad#function-vnf_join">vnf_join</a>([VNF, VNF, VNF, ...]);</code></p>
</blockquote>
<blockquote>
<p><code>vnf = <a href="vnf.scad#function-vnf_from_polygons">vnf_from_polygons</a>(polygons, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>vnf = <a href="vnf.scad#function-vnf_from_region">vnf_from_region</a>(region, [transform], [reverse]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: VNF Testing and Access</h3><a id="user-content-section-vnf-testing-and-access" class="anchor" aria-label="Permalink: Section: VNF Testing and Access" href="#section-vnf-testing-and-access"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>bool = <a href="vnf.scad#function-is_vnf">is_vnf</a>(x);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Altering the VNF Internals</h3><a id="user-content-section-altering-the-vnf-internals" class="anchor" aria-label="Permalink: Section: Altering the VNF Internals" href="#section-altering-the-vnf-internals"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>rvnf = <a href="vnf.scad#function-vnf_reverse_faces">vnf_reverse_faces</a>(vnf);</code></p>
</blockquote>
<blockquote>
<p><code>vnf2 = <a href="vnf.scad#function-vnf_quantize">vnf_quantize</a>(vnf,[q]);</code></p>
</blockquote>
<blockquote>
<p><code>new_vnf = <a href="vnf.scad#function-vnf_merge_points">vnf_merge_points</a>(vnf, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>clean_vnf = <a href="vnf.scad#function-vnf_drop_unused_points">vnf_drop_unused_points</a>(vnf);</code></p>
</blockquote>
<blockquote>
<p><code>vnf2 = <a href="vnf.scad#function-vnf_triangulate">vnf_triangulate</a>(vnf);</code></p>
</blockquote>
<blockquote>
<p><code>newvnf = <a href="vnf.scad#function-vnf_unify_faces">vnf_unify_faces</a>(vnf);</code></p>
</blockquote>
<blockquote>
<p><code>sliced = <a href="vnf.scad#function-vnf_slice">vnf_slice</a>(vnf, dir, cuts);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Turning a VNF into geometry</h3><a id="user-content-section-turning-a-vnf-into-geometry" class="anchor" aria-label="Permalink: Section: Turning a VNF into geometry" href="#section-turning-a-vnf-into-geometry"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="vnf.scad#module-vnf_polyhedron">vnf_polyhedron</a>(vnf) [ATTACHMENTS];</code><br>
<code><a href="vnf.scad#module-vnf_polyhedron">vnf_polyhedron</a>([VNF, VNF, VNF, ...]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="vnf.scad#module-vnf_wireframe">vnf_wireframe</a>(vnf, [width]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Operations on VNFs</h3><a id="user-content-section-operations-on-vnfs" class="anchor" aria-label="Permalink: Section: Operations on VNFs" href="#section-operations-on-vnfs"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>vol = <a href="vnf.scad#function-vnf_volume">vnf_volume</a>(vnf);</code></p>
</blockquote>
<blockquote>
<p><code>area = <a href="vnf.scad#function-vnf_area">vnf_area</a>(vnf);</code></p>
</blockquote>
<blockquote>
<p><code>min_max = <a href="vnf.scad#function-vnf_bounds">vnf_bounds</a>(vnf, [fast]);</code></p>
</blockquote>
<blockquote>
<p><code>region = <a href="vnf.scad#function-projection">projection</a>(vnf, [cut], [z]);</code></p>
</blockquote>
<blockquote>
<p><code>newvnf = <a href="vnf.scad#function-vnf_halfspace">vnf_halfspace</a>(plane, vnf, [closed], [boundary]);</code></p>
</blockquote>
<blockquote>
<p><code>bentvnf = <a href="vnf.scad#function-vnf_bend">vnf_bend</a>(vnf,r|d=,[axis=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="vnf.scad#functionmodule-vnf_hull">vnf_hull</a> = hull_vnf(vnf);</code>  &nbsp; &nbsp; <code><a href="vnf.scad#functionmodule-vnf_hull">vnf_hull</a>(vnf,[fast]);</code></p>
</blockquote>
<blockquote>
<p><code>boundary = <a href="vnf.scad#function-vnf_boundary">vnf_boundary</a>(vnf, [merge=], [idx=]);</code></p>
</blockquote>
<blockquote>
<p><code>newvnf = vnf(vnf, delta, [merge=]);</code></p>
</blockquote>
<blockquote>
<p><code>newvnf = <a href="vnf.scad#function-vnf_sheet">vnf_sheet</a>(vnf, delta, [style=], [merge=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Debugging Polyhedrons</h3><a id="user-content-section-debugging-polyhedrons" class="anchor" aria-label="Permalink: Section: Debugging Polyhedrons" href="#section-debugging-polyhedrons"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="vnf.scad#module-debug_vnf">debug_vnf</a>(vnfs, [faces=], [vertices=], [opacity=], [size=], [convexity=], [filter=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="vnf.scad#module-vnf_validate">vnf_validate</a>(vnf, [size], [show_warns=], [check_isects=], [big_face=], [opacity=], [adjacent=], [label_verts=], [label_faces=], [wireframe=]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: beziers.scad</h2><a id="user-content-libfile-beziersscad" class="anchor" aria-label="Permalink: LibFile: beziers.scad" href="#libfile-beziersscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Bezier Curves</h3><a id="user-content-section-bezier-curves" class="anchor" aria-label="Permalink: Section: Bezier Curves" href="#section-bezier-curves"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>pt = <a href="beziers.scad#function-bezier_points">bezier_points</a>(bezier, u);</code>  &nbsp; &nbsp; <code>ptlist = <a href="beziers.scad#function-bezier_points">bezier_points</a>(bezier, RANGE);</code><br>
<code>ptlist = <a href="beziers.scad#function-bezier_points">bezier_points</a>(bezier, LIST);</code></p>
</blockquote>
<blockquote>
<p><code>path = <a href="beziers.scad#function-bezier_curve">bezier_curve</a>(bezier, [splinesteps], [endpoint]);</code></p>
</blockquote>
<blockquote>
<p><code>deriv = <a href="beziers.scad#function-bezier_derivative">bezier_derivative</a>(bezier, u, [order]);</code><br>
<code>derivs = <a href="beziers.scad#function-bezier_derivative">bezier_derivative</a>(bezier, LIST, [order]);</code><br>
<code>derivs = <a href="beziers.scad#function-bezier_derivative">bezier_derivative</a>(bezier, RANGE, [order]);</code></p>
</blockquote>
<blockquote>
<p><code>tanvec = <a href="beziers.scad#function-bezier_tangent">bezier_tangent</a>(bezier, u);</code>  &nbsp; &nbsp; <code>tanvecs = <a href="beziers.scad#function-bezier_tangent">bezier_tangent</a>(bezier, LIST);</code><br>
<code>tanvecs = <a href="beziers.scad#function-bezier_tangent">bezier_tangent</a>(bezier, RANGE);</code></p>
</blockquote>
<blockquote>
<p><code>crv = <a href="beziers.scad#function-bezier_curvature">bezier_curvature</a>(curve, u);</code>  &nbsp; &nbsp; <code>crvlist = <a href="beziers.scad#function-bezier_curvature">bezier_curvature</a>(curve, LIST);</code><br>
<code>crvlist = <a href="beziers.scad#function-bezier_curvature">bezier_curvature</a>(curve, RANGE);</code></p>
</blockquote>
<blockquote>
<p><code>u = <a href="beziers.scad#function-bezier_closest_point">bezier_closest_point</a>(bezier, pt, [max_err]);</code></p>
</blockquote>
<blockquote>
<p><code>pathlen = <a href="beziers.scad#function-bezier_length">bezier_length</a>(bezier, [start_u], [end_u], [max_deflect]);</code></p>
</blockquote>
<blockquote>
<p><code>u = <a href="beziers.scad#function-bezier_line_intersection">bezier_line_intersection</a>(bezier, line);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Bezier Path Functions</h3><a id="user-content-section-bezier-path-functions" class="anchor" aria-label="Permalink: Section: Bezier Path Functions" href="#section-bezier-path-functions"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>pt = <a href="beziers.scad#function-bezpath_points">bezpath_points</a>(bezpath, curveind, u, [N]);</code><br>
<code>ptlist = <a href="beziers.scad#function-bezpath_points">bezpath_points</a>(bezpath, curveind, LIST, [N]);</code><br>
<code>path = <a href="beziers.scad#function-bezpath_points">bezpath_points</a>(bezpath, curveind, RANGE, [N]);</code></p>
</blockquote>
<blockquote>
<p><code>path = <a href="beziers.scad#function-bezpath_curve">bezpath_curve</a>(bezpath, [splinesteps], [N], [endpoint], [order=])</code></p>
</blockquote>
<blockquote>
<p><code>res = <a href="beziers.scad#function-bezpath_closest_point">bezpath_closest_point</a>(bezpath, pt, [N], [max_err]);</code></p>
</blockquote>
<blockquote>
<p><code>plen = <a href="beziers.scad#function-bezpath_length">bezpath_length</a>(path, [N], [max_deflect]);</code></p>
</blockquote>
<blockquote>
<p><code>bezpath = <a href="beziers.scad#function-path_to_bezpath">path_to_bezpath</a>(path, [closed], [tangents], [uniform], [size=]|[relsize=]);</code></p>
</blockquote>
<blockquote>
<p><code>bezpath = <a href="beziers.scad#function-bezpath_close_to_axis">bezpath_close_to_axis</a>(bezpath, [axis], [N]);</code></p>
</blockquote>
<blockquote>
<p><code>bezpath = <a href="beziers.scad#function-bezpath_offset">bezpath_offset</a>(offset, bezier, [N]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Cubic Bezier Path Construction</h3><a id="user-content-section-cubic-bezier-path-construction" class="anchor" aria-label="Permalink: Section: Cubic Bezier Path Construction" href="#section-cubic-bezier-path-construction"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>pts = <a href="beziers.scad#function-bez_begin">bez_begin</a>(pt, a, r, [p=]);</code>  &nbsp; &nbsp; <code>pts = <a href="beziers.scad#function-bez_begin">bez_begin</a>(pt, VECTOR, [r], [p=]);</code></p>
</blockquote>
<blockquote>
<p><code>pts = <a href="beziers.scad#function-bez_tang">bez_tang</a>(pt, a, r1, r2, [p=]);</code><br>
<code>pts = <a href="beziers.scad#function-bez_tang">bez_tang</a>(pt, VECTOR, [r1], [r2], [p=]);</code></p>
</blockquote>
<blockquote>
<p><code>pts = <a href="beziers.scad#function-bez_joint">bez_joint</a>(pt, a1, a2, r1, r2, [p1=], [p2=]);</code><br>
<code>pts = <a href="beziers.scad#function-bez_joint">bez_joint</a>(pt, VEC1, VEC2, [r1=], [r2=], [p1=], [p2=]);</code></p>
</blockquote>
<blockquote>
<p><code>pts = <a href="beziers.scad#function-bez_end">bez_end</a>(pt, a, r, [p=]);</code>  &nbsp; &nbsp; <code>pts = <a href="beziers.scad#function-bez_end">bez_end</a>(pt, VECTOR, [r], [p=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Bezier Surfaces</h3><a id="user-content-section-bezier-surfaces" class="anchor" aria-label="Permalink: Section: Bezier Surfaces" href="#section-bezier-surfaces"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>bool = <a href="beziers.scad#function-is_bezier_patch">is_bezier_patch</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>patch = <a href="beziers.scad#function-bezier_patch_flat">bezier_patch_flat</a>(size, [N=], [spin=], [orient=], [trans=]);</code></p>
</blockquote>
<blockquote>
<p><code>rpatch = <a href="beziers.scad#function-bezier_patch_reverse">bezier_patch_reverse</a>(patch);</code></p>
</blockquote>
<blockquote>
<p><code>pt = <a href="beziers.scad#function-bezier_patch_points">bezier_patch_points</a>(patch, u, v);</code><br>
<code>ptgrid = <a href="beziers.scad#function-bezier_patch_points">bezier_patch_points</a>(patch, LIST, LIST);</code><br>
<code>ptgrid = <a href="beziers.scad#function-bezier_patch_points">bezier_patch_points</a>(patch, RANGE, RANGE);</code></p>
</blockquote>
<blockquote>
<p><code>vnf = <a href="beziers.scad#function-bezier_vnf">bezier_vnf</a>(patches, [splinesteps], [style]);</code></p>
</blockquote>
<blockquote>
<p><code>vnf = <a href="beziers.scad#function-bezier_vnf_degenerate_patch">bezier_vnf_degenerate_patch</a>(patch, [splinesteps], [reverse]);</code><br>
<code>vnf_edges = <a href="beziers.scad#function-bezier_vnf_degenerate_patch">bezier_vnf_degenerate_patch</a>(patch, [splinesteps], [reverse], return_edges=true);</code></p>
</blockquote>
<blockquote>
<p><code>n = <a href="beziers.scad#function-bezier_patch_normals">bezier_patch_normals</a>(patch, u, v);</code><br>
<code>ngrid = <a href="beziers.scad#function-bezier_patch_normals">bezier_patch_normals</a>(patch, LIST, LIST);</code><br>
<code>ngrid = <a href="beziers.scad#function-bezier_patch_normals">bezier_patch_normals</a>(patch, RANGE, RANGE);</code></p>
</blockquote>
<blockquote>
<p><code>vnf = <a href="beziers.scad#function-bezier_sheet">bezier_sheet</a>(patch, delta, [splinesteps=], [style=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="beziers.scad#functionmodule-bezier_sweep">bezier_sweep</a>(shape, bezier, [splinesteps], [method], [endpoint=], [normal=], [closed=], [twist=], [twist_by_length=], [symmetry=], [scale=], [scale_by_length=], [last_normal=], [caps=], [style=], [convexity=], [anchor=], [cp=], [spin=], [orient=], [atype=]) [ATTACHMENTS];</code><br>
<code>vnf = path_sweep(shape, bezier, [splinesteps], [method], [endpoint=], [normal=], [closed=], [twist=], [twist_by_length=], [symmetry=], [scale=], [scale_by_length=], [last_normal=], [caps=], [style=], [transforms=], [anchor=], [cp=], [spin=], [orient=], [atype=]);</code></p>
</blockquote>
<blockquote>
<p><code>bezier_sweep(shape, bezier, [splinesteps], [method], [endpoint=], [normal=], [closed=], [twist=], [twist_by_length=], [symmetry=], [scale=], [scale_by_length=], [last_normal=], [caps=], [style=], [convexity=], [anchor=], [cp=], [spin=], [orient=], [atype=]) [ATTACHMENTS];</code><br>
<code>vnf = path_sweep(shape, bezier, [splinesteps], [method], [endpoint=], [normal=], [closed=], [twist=], [twist_by_length=], [symmetry=], [scale=], [scale_by_length=], [last_normal=], [caps=], [style=], [transforms=], [anchor=], [cp=], [spin=], [orient=], [atype=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Debugging Beziers</h3><a id="user-content-section-debugging-beziers" class="anchor" aria-label="Permalink: Section: Debugging Beziers" href="#section-debugging-beziers"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="beziers.scad#module-debug_bezier">debug_bezier</a>(bez, [size], [N=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="beziers.scad#module-debug_bezier_patches">debug_bezier_patches</a>(patches, [size=], [splinesteps=], [showcps=], [showdots=], [showpatch=], [convexity=], [style=]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: nurbs.scad</h2><a id="user-content-libfile-nurbsscad" class="anchor" aria-label="Permalink: LibFile: nurbs.scad" href="#libfile-nurbsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: NURBS Curves</h3><a id="user-content-section-nurbs-curves" class="anchor" aria-label="Permalink: Section: NURBS Curves" href="#section-nurbs-curves"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>pts = <a href="nurbs.scad#function-nurbs_curve">nurbs_curve</a>(control, degree, splinesteps, [mult=], [weights=], [type=], [knots=]);</code><br>
<code>pts = <a href="nurbs.scad#function-nurbs_curve">nurbs_curve</a>(control, degree, u=, [mult=], [weights=], [type=], [knots=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="nurbs.scad#module-debug_nurbs">debug_nurbs</a>(control, degree, [width], [splinesteps=], [type=], [mult=], [knots=], [size=], [show_weights=], [show_knots=], [show_idx=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: NURBS Surfaces</h3><a id="user-content-section-nurbs-surfaces" class="anchor" aria-label="Permalink: Section: NURBS Surfaces" href="#section-nurbs-surfaces"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>bool = <a href="nurbs.scad#function-is_nurbs_patch">is_nurbs_patch</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>pointgrid = <a href="nurbs.scad#function-nurbs_patch_points">nurbs_patch_points</a>(patch, degree, [splinesteps], [u=], [v=], [weights=], [type=], [mult=], [knots=]);</code></p>
</blockquote>
<blockquote>
<p><code>vnf = <a href="nurbs.scad#function-nurbs_vnf">nurbs_vnf</a>(patch, degree, [splinesteps], [mult=], [knots=], [weights=], [type=], [style=]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: rounding.scad</h2><a id="user-content-libfile-roundingscad" class="anchor" aria-label="Permalink: LibFile: rounding.scad" href="#libfile-roundingscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Rounding Paths</h3><a id="user-content-section-rounding-paths" class="anchor" aria-label="Permalink: Section: Rounding Paths" href="#section-rounding-paths"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>rounded_path = <a href="rounding.scad#function-round_corners">round_corners</a>(path, [method], [radius=], [cut=], [joint=], [closed=], [verbose=]);</code></p>
</blockquote>
<blockquote>
<p><code>smoothed = <a href="rounding.scad#function-smooth_path">smooth_path</a>(path, [tangents], [size=|relsize=], [method="edges"], [splinesteps=], [closed=], [uniform=]);</code><br>
<code>smoothed = <a href="rounding.scad#function-smooth_path">smooth_path</a>(path, [size=|relsize=], method="corners", [splinesteps=], [closed=]);</code></p>
</blockquote>
<blockquote>
<p><code>joined_path = <a href="rounding.scad#function-path_join">path_join</a>(paths, [joint], [k=], [relocate=], [closed=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="rounding.scad#functionmodule-offset_stroke">offset_stroke</a>(path, [width], [rounded=], [chamfer=], [start=], [end=], [check_valid=], [quality=], [closed=],...) [ATTACHMENTS];</code><br>
<code>path = <a href="rounding.scad#functionmodule-offset_stroke">offset_stroke</a>(path, [width], closed=false, [rounded=], [chamfer=], [start=], [end=], [check_valid=], [quality=],...);</code><br>
<code>region = <a href="rounding.scad#functionmodule-offset_stroke">offset_stroke</a>(path, [width], closed=true, [rounded=], [chamfer=], [start=], [end=], [check_valid=], [quality=],...);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Three-Dimensional Rounding</h3><a id="user-content-section-three-dimensional-rounding" class="anchor" aria-label="Permalink: Section: Three-Dimensional Rounding" href="#section-three-dimensional-rounding"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="rounding.scad#functionmodule-offset_sweep">offset_sweep</a>(path, [height|length=|h=|l=], [bottom], [top], [offset=], [convexity=],...) [ATTACHMENTS];</code><br>
<code>vnf = <a href="rounding.scad#functionmodule-offset_sweep">offset_sweep</a>(path, [height|length=|h=|l=], [bottom], [top], [offset=], ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="rounding.scad#module-convex_offset_extrude">convex_offset_extrude</a>(height, [bottom], [top], ...) 2D-CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="rounding.scad#functionmodule-rounded_prism">rounded_prism</a>(bottom, [top], [height=|h=|length=|l=], [joint_top=], [joint_bot=], [joint_sides=], [k=], [k_top=], [k_bot=], [k_sides=], [splinesteps=], [debug=], [convexity=],...) [ATTACHMENTS];</code><br>
<code>vnf = <a href="rounding.scad#functionmodule-rounded_prism">rounded_prism</a>(bottom, [top], [height=|h=|length=|l=], [joint_top=], [joint_bot=], [joint_sides=], [k=], [k_top=], [k_bot=], [k_sides=], [splinesteps=], [debug=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="rounding.scad#module-bent_cutout_mask">bent_cutout_mask</a>(r|radius, thickness, path);</code></p>
</blockquote>
<blockquote>
<p><code><a href="rounding.scad#functionmodule-join_prism">join_prism</a>(polygon, base, length=|height=|l=|h=, fillet=, [base_T=], [scale=], [prism_end_T=], [short=], ...) [ATTACHMENTS];</code><br>
<code><a href="rounding.scad#functionmodule-join_prism">join_prism</a>(polygon, base, aux=, fillet=, [base_T=], [aux_T=], [scale=], [prism_end_T=], [short=], ...) [ATTACHMENTS];</code><br>
<code>vnf = <a href="rounding.scad#functionmodule-join_prism">join_prism</a>( ... );</code></p>
</blockquote>
<blockquote>
<p><code><a href="rounding.scad#module-prism_connector">prism_connector</a>(profile, desc1, anchor1, desc2, anchor2, [fillet=], [fillet1=], [fillet2=], [spin_align=], [scale=], [shift1=], [shift2]=, [shift=], [n=], [n1=], [n2=], [k=], [k1=], [k2=], [uniform=], [uniform1=], [uniform2=], [overlap=], [overlap1=], [overlap2=], [smooth_normals=], [smooth_normals=], [smooth_normals1]=, [smooth_normals2=], [debug=], [debug_pos=]);</code></p>
</blockquote>
<blockquote>
<p><code>PARENT() <a href="rounding.scad#module-attach_prism">attach_prism</a>(profile, anchor, [fillet], [rounding], [l=/h=/length=/height=], [endpoint=], [T=], [shift=], [scale=], [inside=], [n=], [n_base=], [n_end=], [k=], [k_base=], [k_end=], [overlap=], [uniform=], [smooth_normals=], [edge_r=], [edge_joint=], [edge_k=], [debug=] ) CHILDREN;</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: turtle3d.scad</h2><a id="user-content-libfile-turtle3dscad" class="anchor" aria-label="Permalink: LibFile: turtle3d.scad" href="#libfile-turtle3dscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Functions</h3><a id="user-content-section-functions" class="anchor" aria-label="Permalink: Section: Functions" href="#section-functions"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>path = <a href="turtle3d.scad#function-turtle3d">turtle3d</a>(commands, [state=], [repeat=]);</code><br>
<code>mats = <a href="turtle3d.scad#function-turtle3d">turtle3d</a>(commands, transforms=true, [state=], [repeat=]);</code><br>
<code>state = <a href="turtle3d.scad#function-turtle3d">turtle3d</a>(commands, full_state=true, [state=], [repeat=]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: isosurface.scad</h2><a id="user-content-libfile-isosurfacescad" class="anchor" aria-label="Permalink: LibFile: isosurface.scad" href="#libfile-isosurfacescad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Metaballs</h3><a id="user-content-section-metaballs" class="anchor" aria-label="Permalink: Section: Metaballs" href="#section-metaballs"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="isosurface.scad#functionmodule-metaballs">metaballs</a>(spec, bounding_box, voxel_size, [isovalue=], [closed=], [exact_bounds=], [convexity=], [show_stats=], [show_box=], [debug=] ...) [ATTACHMENTS];</code><br>
<code>vnf = <a href="isosurface.scad#functionmodule-metaballs">metaballs</a>(spec, bounding_box, voxel_size, [isovalue=], [closed=], [exact_bounds=], [convexity=], [show_stats=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="isosurface.scad#functionmodule-metaballs2d">metaballs2d</a>(spec, bounding_box, pixel_size, [isovalue=], [use_centers=], [smoothing=], [exact_bounds=], [show_stats=], [show_box=], [debug=] ...) [ATTACHMENTS];</code><br>
<code>region = <a href="isosurface.scad#functionmodule-metaballs2d">metaballs2d</a>(spec, bounding_box, pixel_size, [isovalue=], [closed=], [use_centers=], [smoothing=], [exact_bounds=], [show_stats=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Isosurfaces (3D) and contours (2D)</h3><a id="user-content-section-isosurfaces-3d-and-contours-2d" class="anchor" aria-label="Permalink: Section: Isosurfaces (3D) and contours (2D)" href="#section-isosurfaces-3d-and-contours-2d"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="isosurface.scad#functionmodule-isosurface">isosurface</a>(f, isovalue, bounding_box, voxel_size, [voxel_count=], [reverse=], [closed=], [exact_bounds=], [show_stats=], ...) [ATTACHMENTS];</code><br>
<code>vnf = <a href="isosurface.scad#functionmodule-isosurface">isosurface</a>(f, isovalue, bounding_box, voxel_size, [voxel_count=], [reverse=], [closed=], [exact_bounds=], [show_stats=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="isosurface.scad#functionmodule-contour">contour</a>(f, isovalue, bounding_box, pixel_size, [pixel_count=], [use_centers=], [smoothing=], [exact_bounds=], [show_stats=], [show_box=], ...) [ATTACHMENTS];</code><br>
<code>region = <a href="isosurface.scad#functionmodule-contour">contour</a>(f, isovalue, bounding_box, pixel_size, [pixel_count=], [pc_centers=], [smoothing=], [closed=], [show_stats=]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: math.scad</h2><a id="user-content-libfile-mathscad" class="anchor" aria-label="Permalink: LibFile: math.scad" href="#libfile-mathscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Math Constants</h3><a id="user-content-section-math-constants" class="anchor" aria-label="Permalink: Section: Math Constants" href="#section-math-constants"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<p>Constants: <a href="math.scad#constant-phi"><code>PHI</code></a> <a href="math.scad#constant-epsilon"><code>EPSILON</code></a> <a href="math.scad#constant-inf"><code>INF</code></a> <a href="math.scad#constant-nan"><code>NAN</code></a></p>
<div class="markdown-heading"><h3 class="heading-element">Section: Interpolation and Counting</h3><a id="user-content-section-interpolation-and-counting" class="anchor" aria-label="Permalink: Section: Interpolation and Counting" href="#section-interpolation-and-counting"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>list = <a href="math.scad#function-count">count</a>(n, [s], [step], [reverse]);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-lerp">lerp</a>(a, b, u);</code>  &nbsp; &nbsp; <code>l = <a href="math.scad#function-lerp">lerp</a>(a, b, LIST);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-lerpn">lerpn</a>(a, b, n);</code>  &nbsp; &nbsp; <code>x = <a href="math.scad#function-lerpn">lerpn</a>(a, b, n, [endpoint]);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-bilerp">bilerp</a>(pts, x, y);</code></p>
</blockquote>
<blockquote>
<p><code>interp_vector = <a href="math.scad#function-slerp">slerp</a>(v1, v2, u);</code></p>
</blockquote>
<blockquote>
<p><code>vec_list = <a href="math.scad#function-slerpn">slerpn</a>(v1, v2, n);</code><br>
<code>vec_list = <a href="math.scad#function-slerpn">slerpn</a>(v1, v2, n, [endpoint]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Miscellaneous Functions</h3><a id="user-content-section-miscellaneous-functions" class="anchor" aria-label="Permalink: Section: Miscellaneous Functions" href="#section-miscellaneous-functions"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>x2 = <a href="math.scad#function-sqr">sqr</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>val = <a href="math.scad#function-log2">log2</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>l = <a href="math.scad#function-hypot">hypot</a>(x, y, [z]);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-factorial">factorial</a>(n, [d]);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-binomial">binomial</a>(n);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-binomial_coefficient">binomial_coefficient</a>(n, k);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-gcd">gcd</a>(a,b)</code></p>
</blockquote>
<blockquote>
<p><code>div = <a href="math.scad#function-lcm">lcm</a>(a, b);</code>  &nbsp; &nbsp; <code>divs = <a href="math.scad#function-lcm">lcm</a>(list);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Hyperbolic Trigonometry</h3><a id="user-content-section-hyperbolic-trigonometry" class="anchor" aria-label="Permalink: Section: Hyperbolic Trigonometry" href="#section-hyperbolic-trigonometry"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>a = <a href="math.scad#function-sinh">sinh</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>a = <a href="math.scad#function-cosh">cosh</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>a = <a href="math.scad#function-tanh">tanh</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>a = <a href="math.scad#function-asinh">asinh</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>a = <a href="math.scad#function-acosh">acosh</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>a = <a href="math.scad#function-atanh">atanh</a>(x);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Quantization</h3><a id="user-content-section-quantization" class="anchor" aria-label="Permalink: Section: Quantization" href="#section-quantization"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>num = <a href="math.scad#function-quant">quant</a>(x, y);</code></p>
</blockquote>
<blockquote>
<p><code>num = <a href="math.scad#function-quantdn">quantdn</a>(x, y);</code></p>
</blockquote>
<blockquote>
<p><code>num = <a href="math.scad#function-quantup">quantup</a>(x, y);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Constraints and Modulos</h3><a id="user-content-section-constraints-and-modulos" class="anchor" aria-label="Permalink: Section: Constraints and Modulos" href="#section-constraints-and-modulos"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>vals = <a href="math.scad#function-constrain">constrain</a>(v, minval, maxval);</code></p>
</blockquote>
<blockquote>
<p><code>mod = <a href="math.scad#function-posmod">posmod</a>(x, m)</code></p>
</blockquote>
<blockquote>
<p><code>ang = <a href="math.scad#function-modang">modang</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>half_ang = <a href="math.scad#function-mean_angle">mean_angle</a>(angle1,angle2);</code></p>
</blockquote>
<blockquote>
<p><code>a = <a href="math.scad#function-fit_to_range">fit_to_range</a>(M, minval, maxval);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Operations on Lists (Sums, Mean, Products)</h3><a id="user-content-section-operations-on-lists-sums-mean-products" class="anchor" aria-label="Permalink: Section: Operations on Lists (Sums, Mean, Products)" href="#section-operations-on-lists-sums-mean-products"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>x = <a href="math.scad#function-sum">sum</a>(v, [dflt]);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-mean">mean</a>(v);</code></p>
</blockquote>
<blockquote>
<p><code>middle = <a href="math.scad#function-median">median</a>(v)</code></p>
</blockquote>
<blockquote>
<p><code>delts = <a href="math.scad#function-deltas">deltas</a>(v,[wrap]);</code></p>
</blockquote>
<blockquote>
<p><code>sums = <a href="math.scad#function-cumsum">cumsum</a>(v);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-product">product</a>(v);</code></p>
</blockquote>
<blockquote>
<p><code>prod_list = <a href="math.scad#function-cumprod">cumprod</a>(list, [right]);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-convolve">convolve</a>(p,q);</code></p>
</blockquote>
<blockquote>
<p><code><a href="math.scad#function-sum_of_sines">sum_of_sines</a>(a,sines)</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Random Number Generation</h3><a id="user-content-section-random-number-generation" class="anchor" aria-label="Permalink: Section: Random Number Generation" href="#section-random-number-generation"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="math.scad#function-rand_int">rand_int</a>(minval, maxval, n, [seed]);</code></p>
</blockquote>
<blockquote>
<p><code>points = <a href="math.scad#function-random_points">random_points</a>(n, dim, [scale], [seed]);</code></p>
</blockquote>
<blockquote>
<p><code>arr = <a href="math.scad#function-gaussian_rands">gaussian_rands</a>([n],[mean], [cov], [seed]);</code></p>
</blockquote>
<blockquote>
<p><code>arr = <a href="math.scad#function-exponential_rands">exponential_rands</a>([n], [lambda], [seed])</code></p>
</blockquote>
<blockquote>
<p><code>points = <a href="math.scad#function-spherical_random_points">spherical_random_points</a>([n], [radius], [seed]);</code></p>
</blockquote>
<blockquote>
<p><code>points = <a href="math.scad#function-random_polygon">random_polygon</a>([n], [size], [seed]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Calculus</h3><a id="user-content-section-calculus" class="anchor" aria-label="Permalink: Section: Calculus" href="#section-calculus"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>x = <a href="math.scad#function-deriv">deriv</a>(data, [h], [closed])</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-deriv2">deriv2</a>(data, [h], [closed])</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-deriv3">deriv3</a>(data, [h], [closed])</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Complex Numbers</h3><a id="user-content-section-complex-numbers" class="anchor" aria-label="Permalink: Section: Complex Numbers" href="#section-complex-numbers"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>z = <a href="math.scad#function-complex">complex</a>(list)</code></p>
</blockquote>
<blockquote>
<p><code>c = <a href="math.scad#function-c_mul">c_mul</a>(z1,z2)</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-c_div">c_div</a>(z1,z2)</code></p>
</blockquote>
<blockquote>
<p><code>w = <a href="math.scad#function-c_conj">c_conj</a>(z)</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-c_real">c_real</a>(z)</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-c_imag">c_imag</a>(z)</code></p>
</blockquote>
<blockquote>
<p><code>I = <a href="math.scad#function-c_ident">c_ident</a>(n)</code></p>
</blockquote>
<blockquote>
<p><code>n = <a href="math.scad#function-c_norm">c_norm</a>(z)</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Polynomials</h3><a id="user-content-section-polynomials" class="anchor" aria-label="Permalink: Section: Polynomials" href="#section-polynomials"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>roots = <a href="math.scad#function-quadratic_roots">quadratic_roots</a>(a, b, c, [real])</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="math.scad#function-polynomial">polynomial</a>(p, z)</code></p>
</blockquote>
<blockquote>
<p><code>x = polymult(p,q)</code>  &nbsp; &nbsp; <code>x = polymult([p1,p2,p3,...])</code></p>
</blockquote>
<blockquote>
<p><code>[quotient,remainder] = <a href="math.scad#function-poly_div">poly_div</a>(n,d)</code></p>
</blockquote>
<blockquote>
<p><code>sum = <a href="math.scad#function-poly_add">poly_add</a>(p,q)</code></p>
</blockquote>
<blockquote>
<p><code>roots = <a href="math.scad#function-poly_roots">poly_roots</a>(p, [tol]);</code></p>
</blockquote>
<blockquote>
<p><code>roots = <a href="math.scad#function-real_roots">real_roots</a>(p, [eps], [tol])</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Operations on Functions</h3><a id="user-content-section-operations-on-functions" class="anchor" aria-label="Permalink: Section: Operations on Functions" href="#section-operations-on-functions"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>x = <a href="math.scad#function-root_find">root_find</a>(f, x0, x1, [tol])</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: linalg.scad</h2><a id="user-content-libfile-linalgscad" class="anchor" aria-label="Permalink: LibFile: linalg.scad" href="#libfile-linalgscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Matrix testing and display</h3><a id="user-content-section-matrix-testing-and-display" class="anchor" aria-label="Permalink: Section: Matrix testing and display" href="#section-matrix-testing-and-display"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>test = <a href="linalg.scad#function-is_matrix">is_matrix</a>(A, [m], [n], [square])</code></p>
</blockquote>
<blockquote>
<p><code>b = <a href="linalg.scad#function-is_matrix_symmetric">is_matrix_symmetric</a>(A, [eps])</code></p>
</blockquote>
<blockquote>
<p><code>b = <a href="linalg.scad#function-is_rotation">is_rotation</a>(A, [dim], [centered])</code></p>
</blockquote>
<blockquote>
<p><code><a href="linalg.scad#functionmodule-echo_matrix">echo_matrix</a>(M, [description], [sig], [sep], [eps]);</code><br>
<code>dummy = <a href="linalg.scad#functionmodule-echo_matrix">echo_matrix</a>(M, [description], [sig], [sep], [eps]),</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Matrix indexing</h3><a id="user-content-section-matrix-indexing" class="anchor" aria-label="Permalink: Section: Matrix indexing" href="#section-matrix-indexing"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>list = <a href="linalg.scad#function-column">column</a>(M, i);</code></p>
</blockquote>
<blockquote>
<p><code>mat = <a href="linalg.scad#function-submatrix">submatrix</a>(M, idx1, idx2);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Matrix construction and modification</h3><a id="user-content-section-matrix-construction-and-modification" class="anchor" aria-label="Permalink: Section: Matrix construction and modification" href="#section-matrix-construction-and-modification"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>mat = <a href="linalg.scad#function-ident">ident</a>(n);</code></p>
</blockquote>
<blockquote>
<p><code>mat = <a href="linalg.scad#function-diagonal_matrix">diagonal_matrix</a>(diag, [offdiag]);</code></p>
</blockquote>
<blockquote>
<p><code>M = <a href="linalg.scad#function-transpose">transpose</a>(M, [reverse]);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="linalg.scad#function-outer_product">outer_product</a>(u,v);</code>  &nbsp; &nbsp; <code>M = <a href="linalg.scad#function-outer_product">outer_product</a>(u,v);</code></p>
</blockquote>
<blockquote>
<p><code>mat = <a href="linalg.scad#function-submatrix_set">submatrix_set</a>(M, A, [m], [n]);</code></p>
</blockquote>
<blockquote>
<p><code>A = <a href="linalg.scad#function-hstack">hstack</a>(M1, M2)</code>  &nbsp; &nbsp; <code>A = <a href="linalg.scad#function-hstack">hstack</a>(M1, M2, M3)</code>  &nbsp; &nbsp; <code>A = <a href="linalg.scad#function-hstack">hstack</a>([M1, M2, M3, ...])</code></p>
</blockquote>
<blockquote>
<p><code>bmat = <a href="linalg.scad#function-block_matrix">block_matrix</a>([[M11, M12,...],[M21, M22,...], ... ]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Solving Linear Equations and Matrix Factorizations</h3><a id="user-content-section-solving-linear-equations-and-matrix-factorizations" class="anchor" aria-label="Permalink: Section: Solving Linear Equations and Matrix Factorizations" href="#section-solving-linear-equations-and-matrix-factorizations"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>solv = <a href="linalg.scad#function-linear_solve">linear_solve</a>(A,b,[pivot])</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="linalg.scad#function-linear_solve3">linear_solve3</a>(A,b)</code></p>
</blockquote>
<blockquote>
<p><code>mat = <a href="linalg.scad#function-matrix_inverse">matrix_inverse</a>(A)</code></p>
</blockquote>
<blockquote>
<p><code>B = <a href="linalg.scad#function-rot_inverse">rot_inverse</a>(A)</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="linalg.scad#function-null_space">null_space</a>(A)</code></p>
</blockquote>
<blockquote>
<p><code>qr = <a href="linalg.scad#function-qr_factor">qr_factor</a>(A,[pivot]);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="linalg.scad#function-back_substitute">back_substitute</a>(R, b, [transpose]);</code></p>
</blockquote>
<blockquote>
<p><code>L = <a href="linalg.scad#function-cholesky">cholesky</a>(A);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Matrix Properties: Determinants, Norm, Trace</h3><a id="user-content-section-matrix-properties-determinants-norm-trace" class="anchor" aria-label="Permalink: Section: Matrix Properties: Determinants, Norm, Trace" href="#section-matrix-properties-determinants-norm-trace"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>d = <a href="linalg.scad#function-det2">det2</a>(M);</code></p>
</blockquote>
<blockquote>
<p><code>d = <a href="linalg.scad#function-det3">det3</a>(M);</code></p>
</blockquote>
<blockquote>
<p><code>d = <a href="linalg.scad#function-det4">det4</a>(M);</code></p>
</blockquote>
<blockquote>
<p><code>d = <a href="linalg.scad#function-determinant">determinant</a>(M);</code></p>
</blockquote>
<blockquote>
<p><code><a href="linalg.scad#function-norm_fro">norm_fro</a>(A)</code></p>
</blockquote>
<blockquote>
<p><code><a href="linalg.scad#function-matrix_trace">matrix_trace</a>(M)</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: vectors.scad</h2><a id="user-content-libfile-vectorsscad" class="anchor" aria-label="Permalink: LibFile: vectors.scad" href="#libfile-vectorsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Vector Testing</h3><a id="user-content-section-vector-testing" class="anchor" aria-label="Permalink: Section: Vector Testing" href="#section-vector-testing"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>bool = <a href="vectors.scad#function-is_vector">is_vector</a>(v, [length], [zero=], [all_nonzero=], [eps=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Scalar operations on vectors</h3><a id="user-content-section-scalar-operations-on-vectors" class="anchor" aria-label="Permalink: Section: Scalar operations on vectors" href="#section-scalar-operations-on-vectors"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>v_new = <a href="vectors.scad#function-add_scalar">add_scalar</a>(v, s);</code></p>
</blockquote>
<blockquote>
<p><code>v3 = <a href="vectors.scad#function-v_mul">v_mul</a>(v1, v2);</code></p>
</blockquote>
<blockquote>
<p><code>v3 = <a href="vectors.scad#function-v_div">v_div</a>(v1, v2);</code></p>
</blockquote>
<blockquote>
<p><code>v2 = <a href="vectors.scad#function-v_abs">v_abs</a>(v);</code></p>
</blockquote>
<blockquote>
<p><code>v2 = <a href="vectors.scad#function-v_ceil">v_ceil</a>(v);</code></p>
</blockquote>
<blockquote>
<p><code>v2 = <a href="vectors.scad#function-v_floor">v_floor</a>(v);</code></p>
</blockquote>
<blockquote>
<p><code>v2 = <a href="vectors.scad#function-v_round">v_round</a>(v);</code></p>
</blockquote>
<blockquote>
<p><code>v2 = <a href="vectors.scad#function-v_lookup">v_lookup</a>(x, v);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Vector Properties</h3><a id="user-content-section-vector-properties" class="anchor" aria-label="Permalink: Section: Vector Properties" href="#section-vector-properties"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>v = <a href="vectors.scad#function-unit">unit</a>(v, [error]);</code></p>
</blockquote>
<blockquote>
<p><code>theta = <a href="vectors.scad#function-v_theta">v_theta</a>([X,Y]);</code></p>
</blockquote>
<blockquote>
<p><code>ang = <a href="vectors.scad#function-vector_angle">vector_angle</a>(v1,v2);</code>  &nbsp; &nbsp; <code>ang = <a href="vectors.scad#function-vector_angle">vector_angle</a>([v1,v2]);</code><br>
<code>ang = <a href="vectors.scad#function-vector_angle">vector_angle</a>(PT1,PT2,PT3);</code>  &nbsp; &nbsp; <code>ang = <a href="vectors.scad#function-vector_angle">vector_angle</a>([PT1,PT2,PT3]);</code></p>
</blockquote>
<blockquote>
<p><code>axis = <a href="vectors.scad#function-vector_axis">vector_axis</a>(v1,v2);</code>  &nbsp; &nbsp; <code>axis = <a href="vectors.scad#function-vector_axis">vector_axis</a>([v1,v2]);</code><br>
<code>axis = <a href="vectors.scad#function-vector_axis">vector_axis</a>(PT1,PT2,PT3);</code>  &nbsp; &nbsp; <code>axis = <a href="vectors.scad#function-vector_axis">vector_axis</a>([PT1,PT2,PT3]);</code></p>
</blockquote>
<blockquote>
<p><code>newv = <a href="vectors.scad#function-vector_bisect">vector_bisect</a>(v1,v2);</code></p>
</blockquote>
<blockquote>
<p><code>perp = <a href="vectors.scad#function-vector_perp">vector_perp</a>(v,w);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Vector Searching</h3><a id="user-content-section-vector-searching" class="anchor" aria-label="Permalink: Section: Vector Searching" href="#section-vector-searching"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>index = <a href="vectors.scad#function-closest_point">closest_point</a>(pt, points);</code></p>
</blockquote>
<blockquote>
<p><code>index = <a href="vectors.scad#function-furthest_point">furthest_point</a>(pt, points);</code></p>
</blockquote>
<blockquote>
<p><code>indices = <a href="vectors.scad#function-vector_search">vector_search</a>(query, r, target);</code></p>
</blockquote>
<blockquote>
<p><code>tree = <a href="vectors.scad#function-vector_search_tree">vector_search_tree</a>(points,leafsize);</code></p>
</blockquote>
<blockquote>
<p><code>indices = <a href="vectors.scad#function-vector_nearest">vector_nearest</a>(query, k, target);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Bounds</h3><a id="user-content-section-bounds" class="anchor" aria-label="Permalink: Section: Bounds" href="#section-bounds"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>pt_pair = <a href="vectors.scad#function-pointlist_bounds">pointlist_bounds</a>(pts);</code></p>
</blockquote>
<blockquote>
<p><code>new_pts = <a href="vectors.scad#function-fit_to_box">fit_to_box</a>(pts, [x=], [y=], [z=]);</code><br>
<code>new_vnf = <a href="vectors.scad#function-fit_to_box">fit_to_box</a>(vnf, [x=], [y=], [z=]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: coords.scad</h2><a id="user-content-libfile-coordsscad" class="anchor" aria-label="Permalink: LibFile: coords.scad" href="#libfile-coordsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Coordinate Manipulation</h3><a id="user-content-section-coordinate-manipulation" class="anchor" aria-label="Permalink: Section: Coordinate Manipulation" href="#section-coordinate-manipulation"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>pt = <a href="coords.scad#function-point2d">point2d</a>(p, [fill]);</code></p>
</blockquote>
<blockquote>
<p><code>pts = <a href="coords.scad#function-path2d">path2d</a>(points);</code></p>
</blockquote>
<blockquote>
<p><code>pt = <a href="coords.scad#function-point3d">point3d</a>(p, [fill]);</code></p>
</blockquote>
<blockquote>
<p><code>pts = <a href="coords.scad#function-path3d">path3d</a>(points, [fill]);</code></p>
</blockquote>
<blockquote>
<p><code>pt = <a href="coords.scad#function-point4d">point4d</a>(p, [fill]);</code></p>
</blockquote>
<blockquote>
<p><code>pt = <a href="coords.scad#function-path4d">path4d</a>(points, [fill]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Coordinate Systems</h3><a id="user-content-section-coordinate-systems" class="anchor" aria-label="Permalink: Section: Coordinate Systems" href="#section-coordinate-systems"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>pt = <a href="coords.scad#function-polar_to_xy">polar_to_xy</a>(r, theta);</code>  &nbsp; &nbsp; <code>pt = <a href="coords.scad#function-polar_to_xy">polar_to_xy</a>([R, THETA]);</code><br>
<code>pts = <a href="coords.scad#function-polar_to_xy">polar_to_xy</a>([[R,THETA], [R,THETA], ...]);</code></p>
</blockquote>
<blockquote>
<p><code>r_theta = <a href="coords.scad#function-xy_to_polar">xy_to_polar</a>(x,y);</code>  &nbsp; &nbsp; <code>r_theta = <a href="coords.scad#function-xy_to_polar">xy_to_polar</a>([X,Y]);</code><br>
<code>r_thetas = <a href="coords.scad#function-xy_to_polar">xy_to_polar</a>([[X,Y], [X,Y], ...]);</code></p>
</blockquote>
<blockquote>
<p><code>xy = <a href="coords.scad#function-project_plane">project_plane</a>(plane, p);</code>  &nbsp; &nbsp; <code>M = <a href="coords.scad#function-project_plane">project_plane</a>(plane)</code></p>
</blockquote>
<blockquote>
<p><code>xyz = <a href="coords.scad#function-lift_plane">lift_plane</a>(plane, p);</code>  &nbsp; &nbsp; <code>M =  <a href="coords.scad#function-lift_plane">lift_plane</a>(plane);</code></p>
</blockquote>
<blockquote>
<p><code>pt = <a href="coords.scad#function-cylindrical_to_xyz">cylindrical_to_xyz</a>(r, theta, z);</code><br>
<code>pt = <a href="coords.scad#function-cylindrical_to_xyz">cylindrical_to_xyz</a>([RADIUS,THETA,Z]);</code><br>
<code>pts = <a href="coords.scad#function-cylindrical_to_xyz">cylindrical_to_xyz</a>([[RADIUS,THETA,Z], [RADIUS,THETA,Z], ...]);</code></p>
</blockquote>
<blockquote>
<p><code>rtz = <a href="coords.scad#function-xyz_to_cylindrical">xyz_to_cylindrical</a>(x,y,z);</code>  &nbsp; &nbsp; <code>rtz = <a href="coords.scad#function-xyz_to_cylindrical">xyz_to_cylindrical</a>([X,Y,Z]);</code><br>
<code>rtzs = <a href="coords.scad#function-xyz_to_cylindrical">xyz_to_cylindrical</a>([[X,Y,Z], [X,Y,Z], ...]);</code></p>
</blockquote>
<blockquote>
<p><code>pt = <a href="coords.scad#function-spherical_to_xyz">spherical_to_xyz</a>(r, theta, phi);</code><br>
<code>pt = <a href="coords.scad#function-spherical_to_xyz">spherical_to_xyz</a>([RADIUS,THETA,PHI]);</code><br>
<code>pts = <a href="coords.scad#function-spherical_to_xyz">spherical_to_xyz</a>([[RADIUS,THETA,PHI], [RADIUS,THETA,PHI], ...]);</code></p>
</blockquote>
<blockquote>
<p><code>r_theta_phi = <a href="coords.scad#function-xyz_to_spherical">xyz_to_spherical</a>(x,y,z)</code>  &nbsp; &nbsp; <code>r_theta_phi = <a href="coords.scad#function-xyz_to_spherical">xyz_to_spherical</a>([X,Y,Z])</code><br>
<code>r_theta_phis = <a href="coords.scad#function-xyz_to_spherical">xyz_to_spherical</a>([[X,Y,Z], [X,Y,Z], ...])</code></p>
</blockquote>
<blockquote>
<p><code>pt = <a href="coords.scad#function-altaz_to_xyz">altaz_to_xyz</a>(alt, az, r);</code>  &nbsp; &nbsp; <code>pt = <a href="coords.scad#function-altaz_to_xyz">altaz_to_xyz</a>([ALT,AZ,R]);</code><br>
<code>pts = <a href="coords.scad#function-altaz_to_xyz">altaz_to_xyz</a>([[ALT,AZ,R], [ALT,AZ,R], ...]);</code></p>
</blockquote>
<blockquote>
<p><code>alt_az_r = <a href="coords.scad#function-xyz_to_altaz">xyz_to_altaz</a>(x,y,z);</code>  &nbsp; &nbsp; <code>alt_az_r = <a href="coords.scad#function-xyz_to_altaz">xyz_to_altaz</a>([X,Y,Z]);</code><br>
<code>alt_az_rs = <a href="coords.scad#function-xyz_to_altaz">xyz_to_altaz</a>([[X,Y,Z], [X,Y,Z], ...]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: geometry.scad</h2><a id="user-content-libfile-geometryscad" class="anchor" aria-label="Permalink: LibFile: geometry.scad" href="#libfile-geometryscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Lines, Rays, and Segments</h3><a id="user-content-section-lines-rays-and-segments" class="anchor" aria-label="Permalink: Section: Lines, Rays, and Segments" href="#section-lines-rays-and-segments"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>pt = <a href="geometry.scad#function-is_point_on_line">is_point_on_line</a>(point, line, [bounded], [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="geometry.scad#function-is_collinear">is_collinear</a>(a, [b, c], [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>dist = <a href="geometry.scad#function-point_line_distance">point_line_distance</a>(pt, line, [bounded]);</code></p>
</blockquote>
<blockquote>
<p><code>dist = <a href="geometry.scad#function-segment_distance">segment_distance</a>(seg1, seg2, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>vec = <a href="geometry.scad#function-line_normal">line_normal</a>([P1,P2])</code>  &nbsp; &nbsp; <code>vec = <a href="geometry.scad#function-line_normal">line_normal</a>(p1,p2)</code></p>
</blockquote>
<blockquote>
<p><code>pt = <a href="geometry.scad#function-line_intersection">line_intersection</a>(line1, line2, [bounded1], [bounded2], [bounded=], [eps=]);</code></p>
</blockquote>
<blockquote>
<p><code>pt = <a href="geometry.scad#function-line_closest_point">line_closest_point</a>(line, pt, [bounded]);</code></p>
</blockquote>
<blockquote>
<p><code>line = <a href="geometry.scad#function-line_from_points">line_from_points</a>(points, [check_collinear], [eps]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Planes</h3><a id="user-content-section-planes" class="anchor" aria-label="Permalink: Section: Planes" href="#section-planes"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>bool = <a href="geometry.scad#function-is_coplanar">is_coplanar</a>(points,[eps]);</code></p>
</blockquote>
<blockquote>
<p><code>plane = <a href="geometry.scad#function-plane3pt">plane3pt</a>(p1, p2, p3);</code>  &nbsp; &nbsp; <code>plane = <a href="geometry.scad#function-plane3pt">plane3pt</a>([p1, p2, p3]);</code></p>
</blockquote>
<blockquote>
<p><code>plane = <a href="geometry.scad#function-plane3pt_indexed">plane3pt_indexed</a>(points, i1, i2, i3);</code></p>
</blockquote>
<blockquote>
<p><code>plane = <a href="geometry.scad#function-plane_from_normal">plane_from_normal</a>(normal, [pt])</code></p>
</blockquote>
<blockquote>
<p><code>plane = <a href="geometry.scad#function-plane_from_points">plane_from_points</a>(points, [check_coplanar], [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>plane = <a href="geometry.scad#function-plane_from_polygon">plane_from_polygon</a>(points, [check_coplanar], [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>vec = <a href="geometry.scad#function-plane_normal">plane_normal</a>(plane);</code></p>
</blockquote>
<blockquote>
<p><code>d = <a href="geometry.scad#function-plane_offset">plane_offset</a>(plane);</code></p>
</blockquote>
<blockquote>
<p><code>pt = <a href="geometry.scad#function-plane_line_intersection">plane_line_intersection</a>(plane, line, [bounded], [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>line = <a href="geometry.scad#function-plane_intersection">plane_intersection</a>(plane1, plane2)</code><br>
<code>pt = <a href="geometry.scad#function-plane_intersection">plane_intersection</a>(plane1, plane2, plane3)</code></p>
</blockquote>
<blockquote>
<p><code>angle = <a href="geometry.scad#function-plane_line_angle">plane_line_angle</a>(plane,line);</code></p>
</blockquote>
<blockquote>
<p><code>pts = <a href="geometry.scad#function-plane_closest_point">plane_closest_point</a>(plane, points);</code></p>
</blockquote>
<blockquote>
<p><code>dist = <a href="geometry.scad#function-point_plane_distance">point_plane_distance</a>(plane, point)</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="geometry.scad#function-are_points_on_plane">are_points_on_plane</a>(points, plane, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="geometry.scad#module-show_plane">show_plane</a>(plane, size, [offset]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Circle Calculations</h3><a id="user-content-section-circle-calculations" class="anchor" aria-label="Permalink: Section: Circle Calculations" href="#section-circle-calculations"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>pts = <a href="geometry.scad#function-circle_line_intersection">circle_line_intersection</a>(r|d=, cp, line, [bounded], [eps=]);</code></p>
</blockquote>
<blockquote>
<p><code>pts = <a href="geometry.scad#function-circle_circle_intersection">circle_circle_intersection</a>(r1|d1=, cp1, r2|d2=, cp2, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>circ = <a href="geometry.scad#function-circle_2tangents">circle_2tangents</a>(r|d=, pt1, pt2, pt3, [tangents=]);</code><br>
<code>circ = <a href="geometry.scad#function-circle_2tangents">circle_2tangents</a>(r|d=, [PT1, PT2, PT3], [tangents=]);</code></p>
</blockquote>
<blockquote>
<p><code>circ = <a href="geometry.scad#function-circle_3points">circle_3points</a>(pt1, pt2, pt3);</code>  &nbsp; &nbsp; <code>circ = <a href="geometry.scad#function-circle_3points">circle_3points</a>([PT1, PT2, PT3]);</code></p>
</blockquote>
<blockquote>
<p><code>tangents = <a href="geometry.scad#function-circle_point_tangents">circle_point_tangents</a>(r|d=, cp, pt);</code></p>
</blockquote>
<blockquote>
<p><code>segs = <a href="geometry.scad#function-circle_circle_tangents">circle_circle_tangents</a>(r1|d1=, cp1, r2|d2=, cp2);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Sphere Calculations</h3><a id="user-content-section-sphere-calculations" class="anchor" aria-label="Permalink: Section: Sphere Calculations" href="#section-sphere-calculations"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>isect = <a href="geometry.scad#function-sphere_line_intersection">sphere_line_intersection</a>(r|d=, cp, line, [bounded], [eps=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Polygons</h3><a id="user-content-section-polygons-1" class="anchor" aria-label="Permalink: Section: Polygons" href="#section-polygons-1"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>area = <a href="geometry.scad#function-polygon_area">polygon_area</a>(poly, [signed]);</code></p>
</blockquote>
<blockquote>
<p><code>c = <a href="geometry.scad#function-centroid">centroid</a>(object, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>vec = <a href="geometry.scad#function-polygon_normal">polygon_normal</a>(poly);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="geometry.scad#function-point_in_polygon">point_in_polygon</a>(point, poly, [nonzero], [eps])</code></p>
</blockquote>
<blockquote>
<p><code>pt = <a href="geometry.scad#function-polygon_line_intersection">polygon_line_intersection</a>(poly, line, [bounded], [nonzero], [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>triangles = <a href="geometry.scad#function-polygon_triangulate">polygon_triangulate</a>(poly, [ind], [error], [eps])</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="geometry.scad#function-is_polygon_clockwise">is_polygon_clockwise</a>(poly);</code></p>
</blockquote>
<blockquote>
<p><code>newpoly = <a href="geometry.scad#function-clockwise_polygon">clockwise_polygon</a>(poly);</code></p>
</blockquote>
<blockquote>
<p><code>newpoly = <a href="geometry.scad#function-ccw_polygon">ccw_polygon</a>(poly);</code></p>
</blockquote>
<blockquote>
<p><code>newpoly = <a href="geometry.scad#function-reverse_polygon">reverse_polygon</a>(poly)</code></p>
</blockquote>
<blockquote>
<p><code>newpoly = <a href="geometry.scad#function-reindex_polygon">reindex_polygon</a>(reference, poly);</code></p>
</blockquote>
<blockquote>
<p><code>newpoly = <a href="geometry.scad#function-align_polygon">align_polygon</a>(reference, poly, [angles], [cp], [tran], [return_ind]);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="geometry.scad#function-are_polygons_equal">are_polygons_equal</a>(poly1, poly2, [eps])</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Convex Hull</h3><a id="user-content-section-convex-hull" class="anchor" aria-label="Permalink: Section: Convex Hull" href="#section-convex-hull"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>face_list_or_index_list = <a href="geometry.scad#function-hull">hull</a>(points);</code></p>
</blockquote>
<blockquote>
<p><code><a href="geometry.scad#module-hull_points">hull_points</a>(points, [fast]);</code></p>
</blockquote>
<blockquote>
<p><code>index_list = <a href="geometry.scad#function-hull2d_path">hull2d_path</a>(points,all)</code></p>
</blockquote>
<blockquote>
<p><code>faces = <a href="geometry.scad#function-hull3d_faces">hull3d_faces</a>(points)</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Convex Sets</h3><a id="user-content-section-convex-sets" class="anchor" aria-label="Permalink: Section: Convex Sets" href="#section-convex-sets"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>bool = <a href="geometry.scad#function-is_polygon_convex">is_polygon_convex</a>(poly, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>dist = <a href="geometry.scad#function-convex_distance">convex_distance</a>(points1, points2,eps);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="geometry.scad#function-convex_collision">convex_collision</a>(points1, points2, [eps]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Rotation Decoding</h3><a id="user-content-section-rotation-decoding" class="anchor" aria-label="Permalink: Section: Rotation Decoding" href="#section-rotation-decoding"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>info = <a href="geometry.scad#function-rot_decode">rot_decode</a>(rotation,[long]); // Returns: [angle,axis,cp,translation]</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: trigonometry.scad</h2><a id="user-content-libfile-trigonometryscad" class="anchor" aria-label="Permalink: LibFile: trigonometry.scad" href="#libfile-trigonometryscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: 2D General Triangle Functions</h3><a id="user-content-section-2d-general-triangle-functions" class="anchor" aria-label="Permalink: Section: 2D General Triangle Functions" href="#section-2d-general-triangle-functions"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>C = <a href="trigonometry.scad#function-law_of_cosines">law_of_cosines</a>(a, b, c);</code>  &nbsp; &nbsp; <code>c = <a href="trigonometry.scad#function-law_of_cosines">law_of_cosines</a>(a, b, C=);</code></p>
</blockquote>
<blockquote>
<p><code>B = <a href="trigonometry.scad#function-law_of_sines">law_of_sines</a>(a, A, b);</code>  &nbsp; &nbsp; <code>b = <a href="trigonometry.scad#function-law_of_sines">law_of_sines</a>(a, A, B=);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: 2D Right Triangle Functions</h3><a id="user-content-section-2d-right-triangle-functions" class="anchor" aria-label="Permalink: Section: 2D Right Triangle Functions" href="#section-2d-right-triangle-functions"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>adj = <a href="trigonometry.scad#function-hyp_opp_to_adj">hyp_opp_to_adj</a>(hyp,opp);</code>  &nbsp; &nbsp; <code>adj = opp_hyp_to_adj(opp,hyp);</code></p>
</blockquote>
<blockquote>
<p><code>adj = <a href="trigonometry.scad#function-hyp_ang_to_adj">hyp_ang_to_adj</a>(hyp,ang);</code>  &nbsp; &nbsp; <code>adj = ang_hyp_to_adj(ang,hyp);</code></p>
</blockquote>
<blockquote>
<p><code>adj = <a href="trigonometry.scad#function-opp_ang_to_adj">opp_ang_to_adj</a>(opp,ang);</code>  &nbsp; &nbsp; <code>adj = ang_opp_to_adj(ang,opp);</code></p>
</blockquote>
<blockquote>
<p><code>opp = <a href="trigonometry.scad#function-hyp_adj_to_opp">hyp_adj_to_opp</a>(hyp,adj);</code>  &nbsp; &nbsp; <code>opp = adj_hyp_to_opp(adj,hyp);</code></p>
</blockquote>
<blockquote>
<p><code>opp = <a href="trigonometry.scad#function-hyp_ang_to_opp">hyp_ang_to_opp</a>(hyp,ang);</code>  &nbsp; &nbsp; <code>opp = ang_hyp_to_opp(ang,hyp);</code></p>
</blockquote>
<blockquote>
<p><code>opp = <a href="trigonometry.scad#function-adj_ang_to_opp">adj_ang_to_opp</a>(adj,ang);</code>  &nbsp; &nbsp; <code>opp = ang_adj_to_opp(ang,adj);</code></p>
</blockquote>
<blockquote>
<p><code>hyp = <a href="trigonometry.scad#function-adj_opp_to_hyp">adj_opp_to_hyp</a>(adj,opp);</code>  &nbsp; &nbsp; <code>hyp = opp_adj_to_hyp(opp,adj);</code></p>
</blockquote>
<blockquote>
<p><code>hyp = <a href="trigonometry.scad#function-adj_ang_to_hyp">adj_ang_to_hyp</a>(adj,ang);</code>  &nbsp; &nbsp; <code>hyp = ang_adj_to_hyp(ang,adj);</code></p>
</blockquote>
<blockquote>
<p><code>hyp = <a href="trigonometry.scad#function-opp_ang_to_hyp">opp_ang_to_hyp</a>(opp,ang);</code>  &nbsp; &nbsp; <code>hyp = ang_opp_to_hyp(ang,opp);</code></p>
</blockquote>
<blockquote>
<p><code>ang = <a href="trigonometry.scad#function-hyp_adj_to_ang">hyp_adj_to_ang</a>(hyp,adj);</code>  &nbsp; &nbsp; <code>ang = adj_hyp_to_ang(adj,hyp);</code></p>
</blockquote>
<blockquote>
<p><code>ang = <a href="trigonometry.scad#function-hyp_opp_to_ang">hyp_opp_to_ang</a>(hyp,opp);</code>  &nbsp; &nbsp; <code>ang = opp_hyp_to_ang(opp,hyp);</code></p>
</blockquote>
<blockquote>
<p><code>ang = <a href="trigonometry.scad#function-adj_opp_to_ang">adj_opp_to_ang</a>(adj,opp);</code>  &nbsp; &nbsp; <code>ang = opp_adj_to_ang(opp,adj);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: version.scad</h2><a id="user-content-libfile-versionscad" class="anchor" aria-label="Permalink: LibFile: version.scad" href="#libfile-versionscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: BOSL Library Version Functions</h3><a id="user-content-section-bosl-library-version-functions" class="anchor" aria-label="Permalink: Section: BOSL Library Version Functions" href="#section-bosl-library-version-functions"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>ver = <a href="version.scad#function-bosl_version">bosl_version</a>();</code></p>
</blockquote>
<blockquote>
<p><code>ver = <a href="version.scad#function-bosl_version_num">bosl_version_num</a>();</code></p>
</blockquote>
<blockquote>
<p><code>ver = <a href="version.scad#function-bosl_version_str">bosl_version_str</a>();</code></p>
</blockquote>
<blockquote>
<p><code><a href="version.scad#module-bosl_required">bosl_required</a>(version);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Generic Version Functions</h3><a id="user-content-section-generic-version-functions" class="anchor" aria-label="Permalink: Section: Generic Version Functions" href="#section-generic-version-functions"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>ver = <a href="version.scad#function-version_to_list">version_to_list</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>str = <a href="version.scad#function-version_to_str">version_to_str</a>(version);</code></p>
</blockquote>
<blockquote>
<p><code>str = <a href="version.scad#function-version_to_num">version_to_num</a>(version);</code></p>
</blockquote>
<blockquote>
<p><code>cmp = <a href="version.scad#function-version_cmp">version_cmp</a>(a,b);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: comparisons.scad</h2><a id="user-content-libfile-comparisonsscad" class="anchor" aria-label="Permalink: LibFile: comparisons.scad" href="#libfile-comparisonsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: List comparison operations</h3><a id="user-content-section-list-comparison-operations" class="anchor" aria-label="Permalink: Section: List comparison operations" href="#section-list-comparison-operations"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>test = <a href="comparisons.scad#function-approx">approx</a>(a, b, [eps])</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="comparisons.scad#function-all_zero">all_zero</a>(x, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>test = <a href="comparisons.scad#function-all_nonzero">all_nonzero</a>(x, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>test = <a href="comparisons.scad#function-all_positive">all_positive</a>(x,[eps]);</code></p>
</blockquote>
<blockquote>
<p><code>test = <a href="comparisons.scad#function-all_negative">all_negative</a>(x, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="comparisons.scad#function-all_nonpositive">all_nonpositive</a>(x, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="comparisons.scad#function-all_nonnegative">all_nonnegative</a>(x, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>b = <a href="comparisons.scad#function-all_equal">all_equal</a>(vec, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="comparisons.scad#function-are_ends_equal">are_ends_equal</a>(list, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="comparisons.scad#function-is_increasing">is_increasing</a>(list, [strict]);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="comparisons.scad#function-is_decreasing">is_decreasing</a>(list, [strict]);</code></p>
</blockquote>
<blockquote>
<p><code>test = <a href="comparisons.scad#function-compare_vals">compare_vals</a>(a, b);</code></p>
</blockquote>
<blockquote>
<p><code>test = <a href="comparisons.scad#function-compare_lists">compare_lists</a>(a, b)</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Finding the index of the minimum or maximum of a list</h3><a id="user-content-section-finding-the-index-of-the-minimum-or-maximum-of-a-list" class="anchor" aria-label="Permalink: Section: Finding the index of the minimum or maximum of a list" href="#section-finding-the-index-of-the-minimum-or-maximum-of-a-list"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>idx = <a href="comparisons.scad#function-min_index">min_index</a>(vals);</code>  &nbsp; &nbsp; <code>idxlist = <a href="comparisons.scad#function-min_index">min_index</a>(vals, all=true);</code></p>
</blockquote>
<blockquote>
<p><code>idx = <a href="comparisons.scad#function-max_index">max_index</a>(vals);</code>  &nbsp; &nbsp; <code>idxlist = <a href="comparisons.scad#function-max_index">max_index</a>(vals, all=true);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Dealing with duplicate list entries</h3><a id="user-content-section-dealing-with-duplicate-list-entries" class="anchor" aria-label="Permalink: Section: Dealing with duplicate list entries" href="#section-dealing-with-duplicate-list-entries"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>idx = <a href="comparisons.scad#function-find_approx">find_approx</a>(val, list, [start=], [eps=]);</code><br>
<code>indices = <a href="comparisons.scad#function-find_approx">find_approx</a>(val, list, all=true, [start=], [eps=]);</code></p>
</blockquote>
<blockquote>
<p><code>list = <a href="comparisons.scad#function-deduplicate">deduplicate</a>(list, [closed], [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>new_idxs = <a href="comparisons.scad#function-deduplicate_indexed">deduplicate_indexed</a>(list, indices, [closed], [eps]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="comparisons.scad#function-list_wrap">list_wrap</a>(path, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="comparisons.scad#function-list_unwrap">list_unwrap</a>(list, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>ulist = <a href="comparisons.scad#function-unique">unique</a>(list);</code></p>
</blockquote>
<blockquote>
<p><code>sorted_counts = <a href="comparisons.scad#function-unique_count">unique_count</a>(list);</code></p>
</blockquote>
<blockquote>
<p><code>ulist = <a href="comparisons.scad#function-unique_approx">unique_approx</a>(data, [eps]);</code></p>
</blockquote>
<blockquote>
<p><code>ulist = unique_approx(data, [eps]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Sorting</h3><a id="user-content-section-sorting" class="anchor" aria-label="Permalink: Section: Sorting" href="#section-sorting"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>slist = <a href="comparisons.scad#function-sort">sort</a>(list, [idx]);</code></p>
</blockquote>
<blockquote>
<p><code>idxlist = <a href="comparisons.scad#function-sortidx">sortidx</a>(list, [idx]);</code></p>
</blockquote>
<blockquote>
<p><code>ulist = <a href="comparisons.scad#function-group_sort">group_sort</a>(list,[idx]);</code></p>
</blockquote>
<blockquote>
<p><code>groupings = <a href="comparisons.scad#function-group_data">group_data</a>(groups, values);</code></p>
</blockquote>
<blockquote>
<p><code>small = <a href="comparisons.scad#function-list_smallest">list_smallest</a>(list, k)</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: lists.scad</h2><a id="user-content-libfile-listsscad" class="anchor" aria-label="Permalink: LibFile: lists.scad" href="#libfile-listsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: List Query Operations</h3><a id="user-content-section-list-query-operations" class="anchor" aria-label="Permalink: Section: List Query Operations" href="#section-list-query-operations"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>bool = <a href="lists.scad#function-is_homogeneous">is_homogeneous</a>(list, [depth]);</code></p>
</blockquote>
<blockquote>
<p><code>llen = <a href="lists.scad#function-min_length">min_length</a>(list);</code></p>
</blockquote>
<blockquote>
<p><code>llen = <a href="lists.scad#function-max_length">max_length</a>(list);</code></p>
</blockquote>
<blockquote>
<p><code>dims = <a href="lists.scad#function-list_shape">list_shape</a>(v, [depth]);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="lists.scad#function-in_list">in_list</a>(val, list, [idx]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: List Indexing</h3><a id="user-content-section-list-indexing" class="anchor" aria-label="Permalink: Section: List Indexing" href="#section-list-indexing"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>item = <a href="lists.scad#function-select">select</a>(list, start);</code>  &nbsp; &nbsp; <code>item = <a href="lists.scad#function-select">select</a>(list, [s:d:e]);</code><br>
<code>item = <a href="lists.scad#function-select">select</a>(list, [i0,i1...,ik]);</code>  &nbsp; &nbsp; <code>list = <a href="lists.scad#function-select">select</a>(list, start, end);</code></p>
</blockquote>
<blockquote>
<p><code>list = <a href="lists.scad#function-slice">slice</a>(list, s, e);</code></p>
</blockquote>
<blockquote>
<p><code>item = <a href="lists.scad#function-last">last</a>(list);</code></p>
</blockquote>
<blockquote>
<p><code>list = <a href="lists.scad#function-list_head">list_head</a>(list, [to]);</code></p>
</blockquote>
<blockquote>
<p><code>list = <a href="lists.scad#function-list_tail">list_tail</a>(list, [from]);</code></p>
</blockquote>
<blockquote>
<p><code>sublist = <a href="lists.scad#function-bselect">bselect</a>(list, index);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: List Construction</h3><a id="user-content-section-list-construction" class="anchor" aria-label="Permalink: Section: List Construction" href="#section-list-construction"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>list = <a href="lists.scad#function-repeat">repeat</a>(val, n);</code></p>
</blockquote>
<blockquote>
<p><code>arr = <a href="lists.scad#function-list_bset">list_bset</a>(indexset, valuelist, [dflt]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="lists.scad#function-list">list</a> = <a href="lists.scad#function-list">list</a>(l)</code></p>
</blockquote>
<blockquote>
<p><code>list = <a href="lists.scad#function-force_list">force_list</a>(value, [n], [fill]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: List Modification</h3><a id="user-content-section-list-modification" class="anchor" aria-label="Permalink: Section: List Modification" href="#section-list-modification"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>rlist = <a href="lists.scad#function-reverse">reverse</a>(list);</code></p>
</blockquote>
<blockquote>
<p><code>rlist = <a href="lists.scad#function-list_rotate">list_rotate</a>(list, [n]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="lists.scad#function-shuffle">shuffle</a>d = <a href="lists.scad#function-shuffle">shuffle</a>(list, [seed]);</code></p>
</blockquote>
<blockquote>
<p><code>newlist = <a href="lists.scad#function-repeat_entries">repeat_entries</a>(list, N, [exact]);</code></p>
</blockquote>
<blockquote>
<p><code>newlist = <a href="lists.scad#function-list_pad">list_pad</a>(list, minlen, [fill]);</code></p>
</blockquote>
<blockquote>
<p><code>list = <a href="lists.scad#function-list_set">list_set</a>(list, indices, values, [dflt], [minlen]);</code></p>
</blockquote>
<blockquote>
<p><code>list = <a href="lists.scad#function-list_insert">list_insert</a>(list, indices, values);</code></p>
</blockquote>
<blockquote>
<p><code>list = <a href="lists.scad#function-list_remove">list_remove</a>(list, ind);</code></p>
</blockquote>
<blockquote>
<p><code>list = <a href="lists.scad#function-list_remove_values">list_remove_values</a>(list, values, [all]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: List Iteration Index Helper</h3><a id="user-content-section-list-iteration-index-helper" class="anchor" aria-label="Permalink: Section: List Iteration Index Helper" href="#section-list-iteration-index-helper"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>range = <a href="lists.scad#function-idx">idx</a>(list, [s=], [e=], [step=]);</code><br>
<code>for(i=<a href="lists.scad#function-idx">idx</a>(list, [s=], [e=], [step=])) ...</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Lists of Subsets</h3><a id="user-content-section-lists-of-subsets" class="anchor" aria-label="Permalink: Section: Lists of Subsets" href="#section-lists-of-subsets"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>p = <a href="lists.scad#function-pair">pair</a>(list, [wrap]);</code><br>
<code>for (p = <a href="lists.scad#function-pair">pair</a>(list, [wrap])) ...  // On each iteration, p contains a list of two adjacent items.</code></p>
</blockquote>
<blockquote>
<p><code>list = <a href="lists.scad#function-triplet">triplet</a>(list, [wrap]);</code>  &nbsp; &nbsp; <code>for (t = <a href="lists.scad#function-triplet">triplet</a>(list, [wrap])) ...</code></p>
</blockquote>
<blockquote>
<p><code>list = <a href="lists.scad#function-combinations">combinations</a>(l, [n]);</code></p>
</blockquote>
<blockquote>
<p><code>list = <a href="lists.scad#function-permutations">permutations</a>(l, [n]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Changing List Structure</h3><a id="user-content-section-changing-list-structure" class="anchor" aria-label="Permalink: Section: Changing List Structure" href="#section-changing-list-structure"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>groups = <a href="lists.scad#function-list_to_matrix">list_to_matrix</a>(v, cnt, [dflt]);</code></p>
</blockquote>
<blockquote>
<p><code>list = <a href="lists.scad#function-flatten">flatten</a>(l);</code></p>
</blockquote>
<blockquote>
<p><code>list = <a href="lists.scad#function-full_flatten">full_flatten</a>(l);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Set Manipulation</h3><a id="user-content-section-set-manipulation" class="anchor" aria-label="Permalink: Section: Set Manipulation" href="#section-set-manipulation"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>s = <a href="lists.scad#function-set_union">set_union</a>(a, b, [get_indices]);</code></p>
</blockquote>
<blockquote>
<p><code>s = <a href="lists.scad#function-set_difference">set_difference</a>(a, b);</code></p>
</blockquote>
<blockquote>
<p><code>s = <a href="lists.scad#function-set_intersection">set_intersection</a>(a, b);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: utility.scad</h2><a id="user-content-libfile-utilityscad" class="anchor" aria-label="Permalink: LibFile: utility.scad" href="#libfile-utilityscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Type Checking</h3><a id="user-content-section-type-checking" class="anchor" aria-label="Permalink: Section: Type Checking" href="#section-type-checking"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>typ = <a href="utility.scad#function-typeof">typeof</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-is_type">is_type</a>(x, types);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-is_def">is_def</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-is_str">is_str</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-is_int">is_int</a>(n);</code>  &nbsp; &nbsp; <code>bool = <a href="utility.scad#function-is_int">is_int</a>eger(n);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-all_integer">all_integer</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-is_nan">is_nan</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-is_finite">is_finite</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-is_range">is_range</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-valid_range">valid_range</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-is_func">is_func</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-is_consistent">is_consistent</a>(list, [pattern]);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-same_shape">same_shape</a>(a,b);</code></p>
</blockquote>
<blockquote>
<p><code>check = <a href="utility.scad#function-is_bool_list">is_bool_list</a>(list,[length])</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Boolean list testing</h3><a id="user-content-section-boolean-list-testing" class="anchor" aria-label="Permalink: Section: Boolean list testing" href="#section-boolean-list-testing"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>bool = <a href="utility.scad#function-any">any</a>(l);</code><br>
<code>bool = <a href="utility.scad#function-any">any</a>(l, func);   // Requires OpenSCAD 2021.01 or later.</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-all">all</a>(l);</code><br>
<code>bool = <a href="utility.scad#function-all">all</a>(l, func);   // Requires OpenSCAD 2021.01 or later.</code></p>
</blockquote>
<blockquote>
<p><code>seq = <a href="utility.scad#function-num_true">num_true</a>(l);</code><br>
<code>seq = <a href="utility.scad#function-num_true">num_true</a>(l, func);  // Requires OpenSCAD 2021.01 or later.</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Handling <code>undef</code>s.</h3><a id="user-content-section-handling-undefs" class="anchor" aria-label="Permalink: Section: Handling undefs." href="#section-handling-undefs"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>val = <a href="utility.scad#function-default">default</a>(val, dflt);</code></p>
</blockquote>
<blockquote>
<p><code>val = <a href="utility.scad#function-first_defined">first_defined</a>(v, [recursive]);</code></p>
</blockquote>
<blockquote>
<p><code>val = <a href="utility.scad#function-one_defined">one_defined</a>(vals, names, [dflt])</code></p>
</blockquote>
<blockquote>
<p><code>cnt = <a href="utility.scad#function-num_defined">num_defined</a>(v);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-any_defined">any_defined</a>(v, [recursive]);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-all_defined">all_defined</a>(v, [recursive]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Undef Safe Arithmetic</h3><a id="user-content-section-undef-safe-arithmetic" class="anchor" aria-label="Permalink: Section: Undef Safe Arithmetic" href="#section-undef-safe-arithmetic"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>x = <a href="utility.scad#function-u_add">u_add</a>(a, b);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="utility.scad#function-u_sub">u_sub</a>(a, b);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="utility.scad#function-u_mul">u_mul</a>(a, b);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="utility.scad#function-u_div">u_div</a>(a, b);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Processing Arguments to Functions and Modules</h3><a id="user-content-section-processing-arguments-to-functions-and-modules" class="anchor" aria-label="Permalink: Section: Processing Arguments to Functions and Modules" href="#section-processing-arguments-to-functions-and-modules"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>anchr = <a href="utility.scad#function-get_anchor">get_anchor</a>(anchor,center,[uncentered],[dflt]);</code></p>
</blockquote>
<blockquote>
<p><code>r = <a href="utility.scad#function-get_radius">get_radius</a>([r1=], [r2=], [r=], [d1=], [d2=], [d=], [dflt=]);</code></p>
</blockquote>
<blockquote>
<p><code>vec = <a href="utility.scad#function-scalar_vec3">scalar_vec3</a>(v, [dflt]);</code></p>
</blockquote>
<blockquote>
<p><code>sides = <a href="utility.scad#function-segs">segs</a>(r, [angle]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="utility.scad#module-no_children">no_children</a>($children);</code></p>
</blockquote>
<blockquote>
<p><code><a href="utility.scad#module-req_children">req_children</a>($children);</code></p>
</blockquote>
<blockquote>
<p><code>dummy = <a href="utility.scad#function-no_function">no_function</a>(name)</code></p>
</blockquote>
<blockquote>
<p><code><a href="utility.scad#module-no_module">no_module</a>();</code></p>
</blockquote>
<blockquote>
<p><code><a href="utility.scad#module-deprecate">deprecate</a>(new_name);</code></p>
</blockquote>
<blockquote>
<p><code><a href="utility.scad#module-echo_viewport">echo_viewport</a>();</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Testing Helpers</h3><a id="user-content-section-testing-helpers" class="anchor" aria-label="Permalink: Section: Testing Helpers" href="#section-testing-helpers"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="utility.scad#module-assert_approx">assert_approx</a>(got, expected, [info]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="utility.scad#module-assert_equal">assert_equal</a>(got, expected, [info]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="utility.scad#module-shape_compare">shape_compare</a>([eps]) {TEST_SHAPE; EXPECTED_SHAPE;}</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: C-Style For Loop Helpers</h3><a id="user-content-section-c-style-for-loop-helpers" class="anchor" aria-label="Permalink: Section: C-Style For Loop Helpers" href="#section-c-style-for-loop-helpers"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>bool = <a href="utility.scad#function-looping">looping</a>(state);</code></p>
</blockquote>
<blockquote>
<p><code>state = <a href="utility.scad#function-loop_while">loop_while</a>(state, continue);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="utility.scad#function-loop_done">loop_done</a>(state);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: strings.scad</h2><a id="user-content-libfile-stringsscad" class="anchor" aria-label="Permalink: LibFile: strings.scad" href="#libfile-stringsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Extracting substrings</h3><a id="user-content-section-extracting-substrings" class="anchor" aria-label="Permalink: Section: Extracting substrings" href="#section-extracting-substrings"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>newstr = <a href="strings.scad#function-substr">substr</a>(str, [pos], [len]);</code></p>
</blockquote>
<blockquote>
<p><code>newstr = <a href="strings.scad#function-suffix">suffix</a>(str,len);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: String Searching</h3><a id="user-content-section-string-searching" class="anchor" aria-label="Permalink: Section: String Searching" href="#section-string-searching"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>ind = <a href="strings.scad#function-str_find">str_find</a>(str,pattern,[last=],[all=],[start=]);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="strings.scad#function-starts_with">starts_with</a>(str,pattern);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="strings.scad#function-ends_with">ends_with</a>(str,pattern);</code></p>
</blockquote>
<blockquote>
<p><code>string_list = <a href="strings.scad#function-str_split">str_split</a>(str, sep, [keep_nulls]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: String modification</h3><a id="user-content-section-string-modification" class="anchor" aria-label="Permalink: Section: String modification" href="#section-string-modification"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>str = <a href="strings.scad#function-str_join">str_join</a>(list, [sep]);</code></p>
</blockquote>
<blockquote>
<p><code>str = <a href="strings.scad#function-str_strip">str_strip</a>(s,c,[start],[end]);</code></p>
</blockquote>
<blockquote>
<p><code>padded = <a href="strings.scad#function-str_pad">str_pad</a>(str, length, char, [left]);</code></p>
</blockquote>
<blockquote>
<p><code>newstr = <a href="strings.scad#function-str_replace_char">str_replace_char</a>(str, char, replace);</code></p>
</blockquote>
<blockquote>
<p><code>newstr = <a href="strings.scad#function-downcase">downcase</a>(str);</code></p>
</blockquote>
<blockquote>
<p><code>newstr = <a href="strings.scad#function-upcase">upcase</a>(str);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Random strings</h3><a id="user-content-section-random-strings" class="anchor" aria-label="Permalink: Section: Random strings" href="#section-random-strings"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>str = <a href="strings.scad#function-rand_str">rand_str</a>(n, [charset], [seed]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Parsing strings into numbers</h3><a id="user-content-section-parsing-strings-into-numbers" class="anchor" aria-label="Permalink: Section: Parsing strings into numbers" href="#section-parsing-strings-into-numbers"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>num = <a href="strings.scad#function-parse_int">parse_int</a>(str, [base])</code></p>
</blockquote>
<blockquote>
<p><code>num = <a href="strings.scad#function-parse_float">parse_float</a>(str);</code></p>
</blockquote>
<blockquote>
<p><code>num = <a href="strings.scad#function-parse_frac">parse_frac</a>(str,[mixed=],[improper=],[signed=]);</code></p>
</blockquote>
<blockquote>
<p><code>num = <a href="strings.scad#function-parse_num">parse_num</a>(str);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Formatting numbers into strings</h3><a id="user-content-section-formatting-numbers-into-strings" class="anchor" aria-label="Permalink: Section: Formatting numbers into strings" href="#section-formatting-numbers-into-strings"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>str = <a href="strings.scad#function-format_int">format_int</a>(i, [mindigits]);</code></p>
</blockquote>
<blockquote>
<p><code>s = <a href="strings.scad#function-format_fixed">format_fixed</a>(f, [digits]);</code></p>
</blockquote>
<blockquote>
<p><code>str = <a href="strings.scad#function-format_float">format_float</a>(f,[sig]);</code></p>
</blockquote>
<blockquote>
<p><code>s = <a href="strings.scad#function-format">format</a>(fmt, vals);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Checking character class</h3><a id="user-content-section-checking-character-class" class="anchor" aria-label="Permalink: Section: Checking character class" href="#section-checking-character-class"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>x = <a href="strings.scad#function-is_lower">is_lower</a>(s);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="strings.scad#function-is_upper">is_upper</a>(s);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="strings.scad#function-is_digit">is_digit</a>(s);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="strings.scad#function-is_hexdigit">is_hexdigit</a>(s);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="strings.scad#function-is_letter">is_letter</a>(s);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: structs.scad</h2><a id="user-content-libfile-structsscad" class="anchor" aria-label="Permalink: LibFile: structs.scad" href="#libfile-structsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: struct operations</h3><a id="user-content-section-struct-operations" class="anchor" aria-label="Permalink: Section: struct operations" href="#section-struct-operations"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>struct2 = <a href="structs.scad#function-struct_set">struct_set</a>(struct, key, value, [grow=]);</code><br>
<code>struct2 = <a href="structs.scad#function-struct_set">struct_set</a>(struct, [key1, value1, key2, value2, ...], [grow=]);</code></p>
</blockquote>
<blockquote>
<p><code>struct2 = <a href="structs.scad#function-struct_remove">struct_remove</a>(struct, key);</code></p>
</blockquote>
<blockquote>
<p><code>val = <a href="structs.scad#function-struct_val">struct_val</a>(struct, key, default);</code></p>
</blockquote>
<blockquote>
<p><code>keys = <a href="structs.scad#function-struct_keys">struct_keys</a>(struct);</code></p>
</blockquote>
<blockquote>
<p><code><a href="structs.scad#functionmodule-echo_struct">echo_struct</a>(struct, [name]);</code>  &nbsp; &nbsp; <code>foo = <a href="structs.scad#functionmodule-echo_struct">echo_struct</a>(struct, [name]);</code></p>
</blockquote>
<blockquote>
<p><code>bool = <a href="structs.scad#function-is_struct">is_struct</a>(struct);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: fnliterals.scad</h2><a id="user-content-libfile-fnliteralsscad" class="anchor" aria-label="Permalink: LibFile: fnliterals.scad" href="#libfile-fnliteralsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Function Literal Algorithms</h3><a id="user-content-section-function-literal-algorithms" class="anchor" aria-label="Permalink: Section: Function Literal Algorithms" href="#section-function-literal-algorithms"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>lst = <a href="fnliterals.scad#function-map">map</a>(func, list);</code>  &nbsp; &nbsp; <code>lst = <a href="fnliterals.scad#function-map">map</a>(function (x) x+1, list);</code></p>
</blockquote>
<blockquote>
<p><code>lst = <a href="fnliterals.scad#function-filter">filter</a>(func, list);</code>  &nbsp; &nbsp; <code>lst = <a href="fnliterals.scad#function-filter">filter</a>(function (x) x&gt;1, list);</code></p>
</blockquote>
<blockquote>
<p><code>res = <a href="fnliterals.scad#function-reduce">reduce</a>(func, list, [init]);</code><br>
<code>res = <a href="fnliterals.scad#function-reduce">reduce</a>(function (a,b) a+b, list, &lt;init=);</code></p>
</blockquote>
<blockquote>
<p><code>res = <a href="fnliterals.scad#function-accumulate">accumulate</a>(func, list, [init]);</code><br>
<code>res = <a href="fnliterals.scad#function-accumulate">accumulate</a>(function (a,b) a+b, list, [init=]);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="fnliterals.scad#function-while">while</a>(init, cond, func);</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="fnliterals.scad#function-for_n">for_n</a>(n, init, func);</code></p>
</blockquote>
<blockquote>
<p><code>indices = <a href="fnliterals.scad#function-find_all">find_all</a>(func, list);</code><br>
<code>indices = <a href="fnliterals.scad#function-find_all">find_all</a>(function (x) x&gt;1, list);</code></p>
</blockquote>
<blockquote>
<p><code>idx = <a href="fnliterals.scad#function-find_first">find_first</a>(func, list, [start=]);</code></p>
</blockquote>
<blockquote>
<p><code>idx = <a href="fnliterals.scad#function-binsearch">binsearch</a>(key,list, [cmp]);</code></p>
</blockquote>
<blockquote>
<p><code>hx = <a href="fnliterals.scad#function-simple_hash">simple_hash</a>(x);</code></p>
</blockquote>
<blockquote>
<p><code>hm = <a href="fnliterals.scad#function-hashmap">hashmap</a>([hashsize=]);</code><br>
<code>hm = <a href="fnliterals.scad#function-hashmap">hashmap</a>(items=KEYVAL_LIST, [hashsize=]);</code>  &nbsp; &nbsp; <code>hm2 = hm(key, val);</code><br>
<code>hm2 = hm(additems=KEYVAL_LIST);</code>  &nbsp; &nbsp; <code>hm2 = hm(del=KEY);</code>  &nbsp; &nbsp; <code>x = hm(key);</code><br>
<code>for (kv=hm()) let(k=kv[0], v=kv[1]) ...</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Function Meta-Generators</h3><a id="user-content-section-function-meta-generators" class="anchor" aria-label="Permalink: Section: Function Meta-Generators" href="#section-function-meta-generators"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_1arg">f_1arg</a>(func);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_2arg">f_2arg</a>(target_func);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_2arg_simple">f_2arg_simple</a>(target_func);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_3arg">f_3arg</a>(target_func);</code></p>
</blockquote>
<blockquote>
<p><code>newfunc = <a href="fnliterals.scad#function-ival">ival</a>(func);</code></p>
</blockquote>
<blockquote>
<p><code>newfunc = <a href="fnliterals.scad#function-xval">xval</a>(func);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Comparator Generators</h3><a id="user-content-section-comparator-generators" class="anchor" aria-label="Permalink: Section: Comparator Generators" href="#section-comparator-generators"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_cmp">f_cmp</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_cmp">f_cmp</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_cmp">f_cmp</a>(a,b);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_gt">f_gt</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_gt">f_gt</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_gt">f_gt</a>(a,b);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_lt">f_lt</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_lt">f_lt</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_lt">f_lt</a>(a,b);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_gte">f_gte</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_gte">f_gte</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_gte">f_gte</a>(a,b);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_lte">f_lte</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_lte">f_lte</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_lte">f_lte</a>(a,b);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_eq">f_eq</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_eq">f_eq</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_eq">f_eq</a>(a,b);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_neq">f_neq</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_neq">f_neq</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_neq">f_neq</a>(a,b);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_approx">f_approx</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_approx">f_approx</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_approx">f_approx</a>(a,b);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_napprox">f_napprox</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_napprox">f_napprox</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_napprox">f_napprox</a>(a,b);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Logic Operators</h3><a id="user-content-section-logic-operators" class="anchor" aria-label="Permalink: Section: Logic Operators" href="#section-logic-operators"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_or">f_or</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_or">f_or</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_or">f_or</a>(b=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_or">f_or</a>(a=,b=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_and">f_and</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_and">f_and</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_and">f_and</a>(b=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_and">f_and</a>(a=,b=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_nor">f_nor</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_nor">f_nor</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_nor">f_nor</a>(b=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_nor">f_nor</a>(a=,b=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_nand">f_nand</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_nand">f_nand</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_nand">f_nand</a>(b=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_nand">f_nand</a>(a=,b=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_xor">f_xor</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_xor">f_xor</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_xor">f_xor</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_xor">f_xor</a>(a=,b=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_not">f_not</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_not">f_not</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_even">f_even</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_even">f_even</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_odd">f_odd</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_odd">f_odd</a>(a);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Math Operators</h3><a id="user-content-section-math-operators" class="anchor" aria-label="Permalink: Section: Math Operators" href="#section-math-operators"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_add">f_add</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_add">f_add</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_add">f_add</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_add">f_add</a>(a=,b=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_sub">f_sub</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_sub">f_sub</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_sub">f_sub</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_sub">f_sub</a>(a=,b=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_mul">f_mul</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_mul">f_mul</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_mul">f_mul</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_mul">f_mul</a>(a=,b=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_div">f_div</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_div">f_div</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_div">f_div</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_div">f_div</a>(a=,b=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_mod">f_mod</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_mod">f_mod</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_mod">f_mod</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_mod">f_mod</a>(a=,b=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_pow">f_pow</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_pow">f_pow</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_pow">f_pow</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_pow">f_pow</a>(a=,b=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_neg">f_neg</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_neg">f_neg</a>(a);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Min/Max Operators</h3><a id="user-content-section-minmax-operators" class="anchor" aria-label="Permalink: Section: Min/Max Operators" href="#section-minmax-operators"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_min">f_min</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_min">f_min</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_max">f_max</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_max">f_max</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_min2">f_min2</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_min2">f_min2</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_min2">f_min2</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_min2">f_min2</a>(a=,b=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_max2">f_max2</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_max2">f_max2</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_max2">f_max2</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_max2">f_max2</a>(a=,b=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_min3">f_min3</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_min3">f_min3</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_min3">f_min3</a>(b=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_min3">f_min3</a>(c=);</code><br>
<code>fn = <a href="fnliterals.scad#function-f_min3">f_min3</a>(a=,b=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_min3">f_min3</a>(b=,c=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_min3">f_min3</a>(a=,c=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_min3">f_min3</a>(a=,b=,c=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_max3">f_max3</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_max3">f_max3</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_max3">f_max3</a>(b=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_max3">f_max3</a>(c=);</code><br>
<code>fn = <a href="fnliterals.scad#function-f_max3">f_max3</a>(a=,b=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_max3">f_max3</a>(b=,c=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_max3">f_max3</a>(a=,c=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_max3">f_max3</a>(a=,b=,c=);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Trigonometry Operators</h3><a id="user-content-section-trigonometry-operators" class="anchor" aria-label="Permalink: Section: Trigonometry Operators" href="#section-trigonometry-operators"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_sin">f_sin</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_sin">f_sin</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_cos">f_cos</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_cos">f_cos</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_tan">f_tan</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_tan">f_tan</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_asin">f_asin</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_asin">f_asin</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_acos">f_acos</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_acos">f_acos</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_atan">f_atan</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_atan">f_atan</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_atan2">f_atan2</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_atan2">f_atan2</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_atan2">f_atan2</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_atan2">f_atan2</a>(a=,b=);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: String Operators</h3><a id="user-content-section-string-operators" class="anchor" aria-label="Permalink: Section: String Operators" href="#section-string-operators"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_len">f_len</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_len">f_len</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_chr">f_chr</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_chr">f_chr</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_ord">f_ord</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_ord">f_ord</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_str">f_str</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_str">f_str</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_str2">f_str2</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_str2">f_str2</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_str2">f_str2</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_str2">f_str2</a>(a=,b=);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_str3">f_str3</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_str3">f_str3</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_str3">f_str3</a>(b=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_str3">f_str3</a>(c=);</code><br>
<code>fn = <a href="fnliterals.scad#function-f_str3">f_str3</a>(a=,b=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_str3">f_str3</a>(b=,c=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_str3">f_str3</a>(a=,c=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_str3">f_str3</a>(a=,b=,c=);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Miscellaneous Operators</h3><a id="user-content-section-miscellaneous-operators" class="anchor" aria-label="Permalink: Section: Miscellaneous Operators" href="#section-miscellaneous-operators"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_floor">f_floor</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_floor">f_floor</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_round">f_round</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_round">f_round</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_ceil">f_ceil</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_ceil">f_ceil</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_abs">f_abs</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_abs">f_abs</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_sign">f_sign</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_sign">f_sign</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_ln">f_ln</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_ln">f_ln</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_log">f_log</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_log">f_log</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_exp">f_exp</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_exp">f_exp</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_sqr">f_sqr</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_sqr">f_sqr</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_sqrt">f_sqrt</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_sqrt">f_sqrt</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_norm">f_norm</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_norm">f_norm</a>(a);</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_cross">f_cross</a>();</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_cross">f_cross</a>(a=);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_cross">f_cross</a>(b);</code>  &nbsp; &nbsp; <code>fn = <a href="fnliterals.scad#function-f_cross">f_cross</a>(a=,b=);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Type Queries</h3><a id="user-content-section-type-queries" class="anchor" aria-label="Permalink: Section: Type Queries" href="#section-type-queries"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_def">f_is_def</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_undef">f_is_undef</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_bool">f_is_bool</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_num">f_is_num</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_int">f_is_int</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_nan">f_is_nan</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_finite">f_is_finite</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_string">f_is_string</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_list">f_is_list</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_range">f_is_range</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_function">f_is_function</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_vector">f_is_vector</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_path">f_is_path</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_region">f_is_region</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_vnf">f_is_vnf</a>();</code></p>
</blockquote>
<blockquote>
<p><code>fn = <a href="fnliterals.scad#function-f_is_patch">f_is_patch</a>();</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: threading.scad</h2><a id="user-content-libfile-threadingscad" class="anchor" aria-label="Permalink: LibFile: threading.scad" href="#libfile-threadingscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Standard (UTS/ISO) Threading</h3><a id="user-content-section-standard-utsiso-threading" class="anchor" aria-label="Permalink: Section: Standard (UTS/ISO) Threading" href="#section-standard-utsiso-threading"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="threading.scad#module-threaded_rod">threaded_rod</a>(d, l|length, pitch, [internal=], ...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="threading.scad#module-threaded_nut">threaded_nut</a>(nutwidth, id, h|height|thickness, pitch,...) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Trapezoidal Threading</h3><a id="user-content-section-trapezoidal-threading" class="anchor" aria-label="Permalink: Section: Trapezoidal Threading" href="#section-trapezoidal-threading"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="threading.scad#module-trapezoidal_threaded_rod">trapezoidal_threaded_rod</a>(d, l|length, pitch, [thread_angle=|flank_angle=], [thread_depth=], [internal=], ...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="threading.scad#module-trapezoidal_threaded_nut">trapezoidal_threaded_nut</a>(nutwidth, id, h|height|thickness, pitch, [thread_angle=|flank_angle=], [thread_depth], ...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="threading.scad#module-acme_threaded_rod">acme_threaded_rod</a>(d, l|length, tpi|pitch=, [internal=], ...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="threading.scad#module-acme_threaded_nut">acme_threaded_nut</a>(nutwidth, id, h|height|thickness, tpi|pitch=, [shape=], ...) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Pipe Threading</h3><a id="user-content-section-pipe-threading" class="anchor" aria-label="Permalink: Section: Pipe Threading" href="#section-pipe-threading"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="threading.scad#module-npt_threaded_rod">npt_threaded_rod</a>(size, [internal=], ...) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Buttress Threading</h3><a id="user-content-section-buttress-threading" class="anchor" aria-label="Permalink: Section: Buttress Threading" href="#section-buttress-threading"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="threading.scad#module-buttress_threaded_rod">buttress_threaded_rod</a>(d, l|length, pitch, [internal=], ...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="threading.scad#module-buttress_threaded_nut">buttress_threaded_nut</a>(nutwidth, id, h|height|thickness, pitch, ...) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Square Threading</h3><a id="user-content-section-square-threading" class="anchor" aria-label="Permalink: Section: Square Threading" href="#section-square-threading"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="threading.scad#module-square_threaded_rod">square_threaded_rod</a>(d, l|length, pitch, [internal=], ...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="threading.scad#module-square_threaded_nut">square_threaded_nut</a>(nutwidth, id, h|height|thickness, pitch, ...) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Ball Screws</h3><a id="user-content-section-ball-screws" class="anchor" aria-label="Permalink: Section: Ball Screws" href="#section-ball-screws"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="threading.scad#module-ball_screw_rod">ball_screw_rod</a>(d, l|length, pitch, [ball_diam], [ball_arc], [internal=], ...) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Generic Threading</h3><a id="user-content-section-generic-threading" class="anchor" aria-label="Permalink: Section: Generic Threading" href="#section-generic-threading"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="threading.scad#module-generic_threaded_rod">generic_threaded_rod</a>(d, l|length, pitch, profile, [internal=], ...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="threading.scad#module-generic_threaded_nut">generic_threaded_nut</a>(nutwidth, id, h|height|thickness, pitch, profile, [$slop], ...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="threading.scad#module-thread_helix">thread_helix</a>(d, pitch, turns=, [thread_depth=], [thread_angle=|flank_angle=], [profile=], [starts=], [internal=], ...) {ATTACHMENTS};</code><br>
<code><a href="threading.scad#module-thread_helix">thread_helix</a>(d1=,d2=, pitch=, turns=, [thread_depth=], [thread_angle=|flank_angle=], [profile=], [starts=], [internal=], ...) {ATTACHMENTS};</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: screws.scad</h2><a id="user-content-libfile-screwsscad" class="anchor" aria-label="Permalink: LibFile: screws.scad" href="#libfile-screwsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Making Screws</h3><a id="user-content-section-making-screws" class="anchor" aria-label="Permalink: Section: Making Screws" href="#section-making-screws"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="screws.scad#module-screw">screw</a>([spec], [head], [drive], [thread=], [drive_size=], [length=|l=], [thread_len=], [undersize=], [shaft_undersize=], [head_undersize=], [tolerance=], [blunt_start=], [details=], [anchor=], [atype=], [orient=], [spin=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="screws.scad#module-screw_hole">screw_hole</a>([spec], [head], [thread=], [length=|l=], [oversize=], [hole_oversize=], [teardrop=], [head_oversize], [tolerance=], [$slop=], [blunt_start=], [anchor=], [atype=], [orient=], [spin=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="screws.scad#module-shoulder_screw">shoulder_screw</a>(s, d, length, [head=], [thread_len=], [tolerance=], [head_size=], [drive=], [drive_size=], [thread=], [undersize=], [shaft_undersize=], [head_undersize=], [shoulder_undersize=],[atype=],[anchor=],[orient=],[spin=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="screws.scad#module-screw_head">screw_head</a>(screw_info, [details],[counterbore],[flat_height],[teardrop],[internal])</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Nuts and nut traps</h3><a id="user-content-section-nuts-and-nut-traps" class="anchor" aria-label="Permalink: Section: Nuts and nut traps" href="#section-nuts-and-nut-traps"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="screws.scad#module-nut">nut</a>([spec], [shape], [thickness], [<a href="screws.scad#module-nut">nut</a>width], [thread=], [tolerance=], [hole_oversize=], [bevel=], [$slop=], [anchor=], [spin=], [orient=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="screws.scad#module-nut_trap_side">nut_trap_side</a>(trap_width, [spec], [shape], [thickness], [nutwidth=], [poke_len=], [poke_diam=], [$slop=], [anchor=], [orient=], [spin=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="screws.scad#module-nut_trap_inline">nut_trap_inline</a>(length|l|heigth|h, [spec], [shape], [$slop=], [anchor=], [orient=], [spin=]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Screw and Nut Information</h3><a id="user-content-section-screw-and-nut-information" class="anchor" aria-label="Permalink: Section: Screw and Nut Information" href="#section-screw-and-nut-information"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>info = <a href="screws.scad#function-screw_info">screw_info</a>(name, [head], [drive], [thread=], [drive_size=], [oversize=], [head_oversize=])</code></p>
</blockquote>
<blockquote>
<p><code>nut_spec = <a href="screws.scad#function-nut_info">nut_info</a>(name, [shape], [thickness=], [thread=], [width=], [hole_oversize=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="screws.scad#function-thread_specification">thread_specification</a>(screw_spec, [tolerance], [internal])</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: screw_drive.scad</h2><a id="user-content-libfile-screw_drivescad" class="anchor" aria-label="Permalink: LibFile: screw_drive.scad" href="#libfile-screw_drivescad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Phillips Drive</h3><a id="user-content-section-phillips-drive" class="anchor" aria-label="Permalink: Section: Phillips Drive" href="#section-phillips-drive"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="screw_drive.scad#module-phillips_mask">phillips_mask</a>(size) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code>depth = <a href="screw_drive.scad#function-phillips_depth">phillips_depth</a>(size, d);</code></p>
</blockquote>
<blockquote>
<p><code>diam = <a href="screw_drive.scad#function-phillips_diam">phillips_diam</a>(size, depth);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Hex drive</h3><a id="user-content-section-hex-drive" class="anchor" aria-label="Permalink: Section: Hex drive" href="#section-hex-drive"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="screw_drive.scad#module-hex_drive_mask">hex_drive_mask</a>(size, length, [anchor], [spin], [orient], [$slop]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Torx Drive</h3><a id="user-content-section-torx-drive" class="anchor" aria-label="Permalink: Section: Torx Drive" href="#section-torx-drive"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="screw_drive.scad#module-torx_mask">torx_mask</a>(size, l, [center]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="screw_drive.scad#module-torx_mask2d">torx_mask2d</a>(size);</code></p>
</blockquote>
<blockquote>
<p><code>info = <a href="screw_drive.scad#function-torx_info">torx_info</a>(size);</code></p>
</blockquote>
<blockquote>
<p><code>diam = <a href="screw_drive.scad#function-torx_diam">torx_diam</a>(size);</code></p>
</blockquote>
<blockquote>
<p><code>depth = <a href="screw_drive.scad#function-torx_depth">torx_depth</a>(size);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Robertson/Square Drives</h3><a id="user-content-section-robertsonsquare-drives" class="anchor" aria-label="Permalink: Section: Robertson/Square Drives" href="#section-robertsonsquare-drives"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="screw_drive.scad#module-robertson_mask">robertson_mask</a>(size, [extra], [ang], [$slop=]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: bottlecaps.scad</h2><a id="user-content-libfile-bottlecapsscad" class="anchor" aria-label="Permalink: LibFile: bottlecaps.scad" href="#libfile-bottlecapsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: PCO-1810 Bottle Threading</h3><a id="user-content-section-pco-1810-bottle-threading" class="anchor" aria-label="Permalink: Section: PCO-1810 Bottle Threading" href="#section-pco-1810-bottle-threading"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="bottlecaps.scad#module-pco1810_neck">pco1810_neck</a>([wall]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="bottlecaps.scad#module-pco1810_cap">pco1810_cap</a>([h], [r|d], [wall], [texture]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: PCO-1881 Bottle Threading</h3><a id="user-content-section-pco-1881-bottle-threading" class="anchor" aria-label="Permalink: Section: PCO-1881 Bottle Threading" href="#section-pco-1881-bottle-threading"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="bottlecaps.scad#module-pco1881_neck">pco1881_neck</a>([wall]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="bottlecaps.scad#module-pco1881_cap">pco1881_cap</a>(wall, [texture]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Generic Bottle Connectors</h3><a id="user-content-section-generic-bottle-connectors" class="anchor" aria-label="Permalink: Section: Generic Bottle Connectors" href="#section-generic-bottle-connectors"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="bottlecaps.scad#module-generic_bottle_neck">generic_bottle_neck</a>([wall], ...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="bottlecaps.scad#module-generic_bottle_cap">generic_bottle_cap</a>(wall, [texture], ...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="bottlecaps.scad#module-bottle_adapter_neck_to_cap">bottle_adapter_neck_to_cap</a>(wall, [texture], ...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="bottlecaps.scad#module-bottle_adapter_cap_to_cap">bottle_adapter_cap_to_cap</a>(wall, [texture]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="bottlecaps.scad#module-bottle_adapter_neck_to_neck">bottle_adapter_neck_to_neck</a>(...) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: SPI Bottle Threading</h3><a id="user-content-section-spi-bottle-threading" class="anchor" aria-label="Permalink: Section: SPI Bottle Threading" href="#section-spi-bottle-threading"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="bottlecaps.scad#module-sp_neck">sp_neck</a>(diam, type, wall|id=, [style=], [bead=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="bottlecaps.scad#module-sp_cap">sp_cap</a>(diam, type, wall, [style=], [top_adj=], [bot_adj=], [texture=], [$slop]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code>true_diam = <a href="bottlecaps.scad#function-sp_diameter">sp_diameter</a>(diam,type)</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: cubetruss.scad</h2><a id="user-content-libfile-cubetrussscad" class="anchor" aria-label="Permalink: LibFile: cubetruss.scad" href="#libfile-cubetrussscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Cube Trusses</h3><a id="user-content-section-cube-trusses" class="anchor" aria-label="Permalink: Section: Cube Trusses" href="#section-cube-trusses"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="cubetruss.scad#module-cubetruss">cubetruss</a>(extents, [clips=], [bracing=], [size=], [strut=], [clipthick=], ...) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="cubetruss.scad#module-cubetruss_corner">cubetruss_corner</a>(h, extents, [bracing=], [size=], [strut=], [clipthick=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="cubetruss.scad#module-cubetruss_support">cubetruss_support</a>([size=], [strut=], [extents=]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Cubetruss Support</h3><a id="user-content-section-cubetruss-support" class="anchor" aria-label="Permalink: Section: Cubetruss Support" href="#section-cubetruss-support"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="cubetruss.scad#module-cubetruss_foot">cubetruss_foot</a>(w, [size=], [strut=], [clipthick=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="cubetruss.scad#module-cubetruss_joiner">cubetruss_joiner</a>([w=], [vert=], [size=], [strut=], [clipthick=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="cubetruss.scad#module-cubetruss_uclip">cubetruss_uclip</a>(dual, [size=], [strut=], [clipthick=]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Cubetruss Primitives</h3><a id="user-content-section-cubetruss-primitives" class="anchor" aria-label="Permalink: Section: Cubetruss Primitives" href="#section-cubetruss-primitives"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="cubetruss.scad#module-cubetruss_segment">cubetruss_segment</a>([size=], [strut=], [bracing=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="cubetruss.scad#module-cubetruss_clip">cubetruss_clip</a>(extents, [size=], [strut=], [clipthick=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code>length = <a href="cubetruss.scad#function-cubetruss_dist">cubetruss_dist</a>(cubes, [gaps], [size=], [strut=]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: gears.scad</h2><a id="user-content-libfile-gearsscad" class="anchor" aria-label="Permalink: LibFile: gears.scad" href="#libfile-gearsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Gears</h3><a id="user-content-section-gears" class="anchor" aria-label="Permalink: Section: Gears" href="#section-gears"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="gears.scad#functionmodule-spur_gear">spur_gear</a>(circ_pitch, teeth, [thickness], [helical=], [pressure_angle=], [profile_shift=], [backlash=], [shaft_diam=], [hide=], [clearance=], [slices=], [internal=], [herringbone=]) [ATTACHMENTS];</code><br>
<code><a href="gears.scad#functionmodule-spur_gear">spur_gear</a>(mod=|diam_pitch=, teeth=, [thickness=], ...) [ATTACHMENTS];</code><br>
<code>vnf = <a href="gears.scad#functionmodule-spur_gear">spur_gear</a>(circ_pitch, teeth, [thickness], ...);</code><br>
<code>vnf = <a href="gears.scad#functionmodule-spur_gear">spur_gear</a>(mod=|diam_pitch=, teeth=, [thickness=], ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="gears.scad#functionmodule-spur_gear2d">spur_gear2d</a>(circ_pitch, teeth, [pressure_angle=], [profile_shift=], [shorten=], [hide=], [shaft_diam=], [clearance=], [backlash=], [internal=]) [ATTACHMENTS];</code><br>
<code><a href="gears.scad#functionmodule-spur_gear2d">spur_gear2d</a>(mod=|diam_pitch=, teeth=, [pressure_angle=], [profile_shift=], [shorten=], [hide=], [shaft_diam=], [clearance=], [backlash=], [internal=]) [ATTACHMENTS];</code><br>
<code>rgn = <a href="gears.scad#functionmodule-spur_gear2d">spur_gear2d</a>(circ_pitch, teeth, [pressure_angle=], [profile_shift=], [shorten=], [hide=], [shaft_diam=], [clearance=], [backlash=], [internal=]);</code><br>
<code>rgn = <a href="gears.scad#functionmodule-spur_gear2d">spur_gear2d</a>(mod=, teeth=, [pressure_angle=], [profile_shift=], [shorten=], [hide=], [shaft_diam=], [clearance=], [backlash=], [internal=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="gears.scad#module-ring_gear">ring_gear</a>(circ_pitch, teeth, thickness, [backing|od=|or=|width=], [pressure_angle=], [helical=], [herringbone=], [profile_shift=], [clearance=], [backlash=]) [ATTACHMENTS];</code><br>
<code><a href="gears.scad#module-ring_gear">ring_gear</a>(mod=, teeth=, thickness=, [backing=|od=|or=|width=], [pressure_angle=], [helical=], [herringbone=], [profile_shift=], [clearance=], [backlash=]) [ATTACHMENTS];</code><br>
<code><a href="gears.scad#module-ring_gear">ring_gear</a>(diam_pitch=, teeth=, thickness=, [backing=|od=|or=|width=], [pressure_angle=], [helical=], [herringbone=], [profile_shift=], [clearance=], [backlash=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="gears.scad#module-ring_gear2d">ring_gear2d</a>(circ_pitch, teeth, [backing|od=|or=|width=], [pressure_angle=], [helical=], [profile_shift=], [clearance=], [backlash=]) [ATTACHMENTS];</code><br>
<code><a href="gears.scad#module-ring_gear2d">ring_gear2d</a>(mod=, teeth=, [backing=|od=|or=|width=], [pressure_angle=], [helical=], [profile_shift=], [clearance=], [backlash=]) [ATTACHMENTS];</code><br>
<code><a href="gears.scad#module-ring_gear2d">ring_gear2d</a>(diam_pitch=, teeth=, [backing=|od=|or=|width=], [pressure_angle=], [helical=], [profile_shift=], [clearance=], [backlash=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="gears.scad#functionmodule-rack">rack</a>(pitch, teeth, thickness, [base|bottom=|width=], [helical=], [pressure_angle=], [backlash=], [clearance=]) [ATTACHMENTS];</code><br>
<code><a href="gears.scad#functionmodule-rack">rack</a>(mod=, teeth=, thickness=, [base=|bottom=|width=], [helical=], [pressure_angle=], [backlash]=, [clearance=]) [ATTACHMENTS];</code><br>
<code>vnf = <a href="gears.scad#functionmodule-rack">rack</a>(pitch, teeth, thickness, [base|bottom=|width=], [helical=], [pressure_angle=], [backlash=], [clearance=]);</code><br>
<code>vnf = <a href="gears.scad#functionmodule-rack">rack</a>(mod=, teeth=, thickness=, [base=|bottom=|width=], [helical=], [pressure_angle=], [backlash=], [clearance=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="gears.scad#functionmodule-rack2d">rack2d</a>(pitch, teeth, [base|bottom=|width=], [pressure_angle=], [backlash=], [clearance=]) [ATTACHMENTS];</code><br>
<code><a href="gears.scad#functionmodule-rack2d">rack2d</a>(mod=, teeth=, [base=|bottom=|width=], [pressure_angle=], [backlash=], [clearance=]) [ATTACHMENTS];</code><br>
<code>path = <a href="gears.scad#functionmodule-rack2d">rack2d</a>(pitch, teeth, [base|bottom=|width=], [pressure_angle=], [backlash=], [clearance=]);</code><br>
<code>path = <a href="gears.scad#functionmodule-rack2d">rack2d</a>(mod=, teeth=, [base=|bottom=|width=], [pressure_angle=], [backlash=], [clearance=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="gears.scad#functionmodule-crown_gear">crown_gear</a>(circ_pitch, teeth, backing, face_width, [pressure_angle=], [clearance=], [backlash=], [profile_shift=], [slices=]);</code><br>
<code><a href="gears.scad#functionmodule-crown_gear">crown_gear</a>(diam_pitch=, teeth=, backing=, face_width=, [pressure_angle=], [clearance=], [backlash=], [profile_shift=], [slices=]);</code><br>
<code><a href="gears.scad#functionmodule-crown_gear">crown_gear</a>(mod=, teeth=, backing=, face_width=, [pressure_angle=], [clearance=], [backlash=], [profile_shift=], [slices=]);</code><br>
<code>vnf = <a href="gears.scad#functionmodule-crown_gear">crown_gear</a>(circ_pitch, teeth, backing, face_width, [pressure_angle=], [clearance=], [backlash=], [profile_shift=], [slices=]);</code><br>
<code>vnf = <a href="gears.scad#functionmodule-crown_gear">crown_gear</a>(diam_pitch=, teeth=, backing=, face_width=, [pressure_angle=], [clearance=], [backlash=], [profile_shift=], [slices=]);</code><br>
<code>vnf = <a href="gears.scad#functionmodule-crown_gear">crown_gear</a>(mod=, teeth=, backing=, face_width=, [pressure_angle=], [clearance=], [backlash=], [profile_shift=], [slices=]);</code></p>
</blockquote>
<blockquote>
<p><code>gear_dist(mod=|diam_pitch=|circ_pitch=, teeth, mate_teeth, [shaft_angle], [shaft_diam], [face_width=], [hide=], [spiral=], [cutter_radius=], [right_handed=], [pressure_angle=], [backing=|thickness=|bottom=], [cone_backing=], [backlash=], [slices=], [internal=], [gear_spin=], ...) [ATTACHMENTS];</code><br>
<code>vnf = gear_dist(mod=|diam_pitch=|circ_pitch=, teeth, mate_teeth, [shaft_angle], [face_width=], [hide=], [spiral=], [cutter_radius=], [right_handed=], [pressure_angle=], , [backing=|thickness=|bottom=], [cone_backing=], [backlash=], [slices=], [internal=], [gear_spin=], ...);</code></p>
</blockquote>
<blockquote>
<p><code><a href="gears.scad#functionmodule-worm">worm</a>(circ_pitch, d, l, [starts=], [left_handed=], [pressure_angle=], [backlash=], [clearance=]);</code><br>
<code><a href="gears.scad#functionmodule-worm">worm</a>(mod=, d=, l=, [starts=], [left_handed=], [pressure_angle=], [backlash=], [clearance=]);</code><br>
<code>vnf = <a href="gears.scad#functionmodule-worm">worm</a>(circ_pitch, d, l, [starts=], [left_handed=], [pressure_angle=], [backlash=], [clearance=]);</code><br>
<code>vnf = <a href="gears.scad#functionmodule-worm">worm</a>(mod=, d=, l=, [starts=], [left_handed=], [pressure_angle=], [backlash=], [clearance=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="gears.scad#functionmodule-enveloping_worm">enveloping_worm</a>(circ_pitch, mate_teeth, d, [left_handed=], [starts=], [arc=], [pressure_angle=]);</code><br>
<code><a href="gears.scad#functionmodule-enveloping_worm">enveloping_worm</a>(mod=, mate_teeth=, d=, [left_handed=], [starts=], [arc=], [pressure_angle=]);</code><br>
<code><a href="gears.scad#functionmodule-enveloping_worm">enveloping_worm</a>(diam_pitch=, mate_teeth=, d=, [left_handed=], [starts=], [arc=], [pressure_angle=]);</code><br>
<code>vnf = <a href="gears.scad#functionmodule-enveloping_worm">enveloping_worm</a>(circ_pitch, mate_teeth, d, [left_handed=], [starts=], [arc=], [pressure_angle=]);</code><br>
<code>vnf = <a href="gears.scad#functionmodule-enveloping_worm">enveloping_worm</a>(mod=, mate_teeth=, d=, [left_handed=], [starts=], [arc=], [pressure_angle=]);</code><br>
<code>vnf = <a href="gears.scad#functionmodule-enveloping_worm">enveloping_worm</a>(diam_pitch=, mate_teeth=, d=, [left_handed=], [starts=], [arc=], [pressure_angle=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="gears.scad#functionmodule-worm_gear">worm_gear</a>(circ_pitch, teeth, worm_diam, [worm_starts=], [worm_arc=], [crowning=], [left_handed=], [pressure_angle=], [backlash=], [clearance=], [slices=], [shaft_diam=]) [ATTACHMENTS];</code><br>
<code><a href="gears.scad#functionmodule-worm_gear">worm_gear</a>(mod=, teeth=, worm_diam=, [worm_starts=], [worm_arc=], [crowning=], [left_handed=], [pressure_angle=], [backlash=], [clearance=], [slices=], [shaft_diam=]) [ATTACHMENTS];</code><br>
<code>vnf = <a href="gears.scad#functionmodule-worm_gear">worm_gear</a>(circ_pitch, teeth, worm_diam, [worm_starts=], [worm_arc=], [crowning=], [left_handed=], [pressure_angle=], [backlash=], [clearance=], [slices=]);</code><br>
<code>vnf = <a href="gears.scad#functionmodule-worm_gear">worm_gear</a>(mod=, teeth=, worm_diam=, [worm_starts=], [worm_arc=], [crowning=], [left_handed=], [pressure_angle=], [backlash=], [clearance=], [slices=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Gear Assemblies</h3><a id="user-content-section-gear-assemblies" class="anchor" aria-label="Permalink: Section: Gear Assemblies" href="#section-gear-assemblies"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>gear_data = <a href="gears.scad#function-planetary_gears">planetary_gears</a>(mod=|circ_pitch=|diam_pitch=, n, max_teeth, ring_carrier=|carrier_ring=|sun_carrier=|carrier_sun=|sun_ring=|ring_sun=, [helical=], [gear_spin=]);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Computing Gear Dimensions</h3><a id="user-content-section-computing-gear-dimensions" class="anchor" aria-label="Permalink: Section: Computing Gear Dimensions" href="#section-computing-gear-dimensions"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>circ_pitch = <a href="gears.scad#function-circular_pitch">circular_pitch</a>(circ_pitch);</code>  &nbsp; &nbsp; <code>circ_pitch = <a href="gears.scad#function-circular_pitch">circular_pitch</a>(mod=);</code><br>
<code>circ_pitch = <a href="gears.scad#function-circular_pitch">circular_pitch</a>(diam_pitch=);</code></p>
</blockquote>
<blockquote>
<p><code>dp = <a href="gears.scad#function-diametral_pitch">diametral_pitch</a>(circ_pitch);</code>  &nbsp; &nbsp; <code>dp = <a href="gears.scad#function-diametral_pitch">diametral_pitch</a>(mod=);</code><br>
<code>dp = <a href="gears.scad#function-diametral_pitch">diametral_pitch</a>(diam_pitch=);</code></p>
</blockquote>
<blockquote>
<p><code>mod = <a href="gears.scad#function-module_value">module_value</a>(circ_pitch);</code>  &nbsp; &nbsp; <code>mod = <a href="gears.scad#function-module_value">module_value</a>(mod=);</code><br>
<code>mod = <a href="gears.scad#function-module_value">module_value</a>(diam_pitch=);</code></p>
</blockquote>
<blockquote>
<p><code>pr = <a href="gears.scad#function-pitch_radius">pitch_radius</a>(pitch, teeth, [helical]);</code><br>
<code>pr = <a href="gears.scad#function-pitch_radius">pitch_radius</a>(mod=, teeth=, [helical=]);</code></p>
</blockquote>
<blockquote>
<p><code>or = <a href="gears.scad#function-outer_radius">outer_radius</a>(circ_pitch, teeth, [helical=], [clearance=], [internal=], [profile_shift=], [shorten=]);</code><br>
<code>or = <a href="gears.scad#function-outer_radius">outer_radius</a>(mod=, teeth=, [helical=], [clearance=], [internal=], [profile_shift=], [shorten=]);</code><br>
<code>or = <a href="gears.scad#function-outer_radius">outer_radius</a>(diam_pitch=, teeth=, [helical=], [clearance=], [internal=], [profile_shift=], [shorten=]);</code></p>
</blockquote>
<blockquote>
<p><code>rr = outer_radius(mod=|circ_pitch=|diam_pitch=, teeth, [helical], [pressure_angle=], [clearance=], [internal=], [profile_shift=], [backlash=]);</code></p>
</blockquote>
<blockquote>
<p><code>ang = <a href="gears.scad#function-bevel_pitch_angle">bevel_pitch_angle</a>(teeth, mate_teeth, [drive_angle=]);</code></p>
</blockquote>
<blockquote>
<p><code>thick = <a href="gears.scad#function-worm_gear_thickness">worm_gear_thickness</a>(pitch, teeth, worm_diam, [worm_arc=], [crowning=], [clearance=]);</code><br>
<code>thick = <a href="gears.scad#function-worm_gear_thickness">worm_gear_thickness</a>(mod=, teeth=, worm_diam=, [worm_arc=], [crowning=], [clearance=]);</code></p>
</blockquote>
<blockquote>
<p><code>dist = <a href="gears.scad#function-worm_dist">worm_dist</a>(mod=|diam_pitch=|circ_pitch=, d, starts, teeth, [profile_shift], [pressure_angle=]);</code></p>
</blockquote>
<blockquote>
<p><code>dist = <a href="gears.scad#function-gear_dist">gear_dist</a>(mod=|diam_pitch=|circ_pitch=, teeth1, teeth2, [helical], [profile_shift1], [profile_shift2], [pressure_angle=], [backlash=]);</code></p>
</blockquote>
<blockquote>
<p><code>dist = <a href="gears.scad#function-gear_dist_skew">gear_dist_skew</a>(mod=|diam_pitch=|circ_pitch=, teeth1, teeth2, helical1, helical2, [profile_shift1], [profile_shift2], [pressure_angle=]</code></p>
</blockquote>
<blockquote>
<p><code>ang = <a href="gears.scad#function-gear_skew_angle">gear_skew_angle</a>(teeth1, teeth2, helical1, helical2, [profile_shift1], [profile_shift2], [pressure_angle=]</code></p>
</blockquote>
<blockquote>
<p><code>total_shift = <a href="gears.scad#function-get_profile_shift">get_profile_shift</a>(mod=|diam_pitch=|circ_pitch=, desired, teeth1, teeth2, [helical], [pressure_angle=],</code></p>
</blockquote>
<blockquote>
<p><code>x = <a href="gears.scad#function-auto_profile_shift">auto_profile_shift</a>(teeth, [pressure_angle], [helical], [profile_shift=]);</code><br>
<code>x = <a href="gears.scad#function-auto_profile_shift">auto_profile_shift</a>(teeth, [pressure_angle], [helical], get_min=);</code><br>
<code>x = <a href="gears.scad#function-auto_profile_shift">auto_profile_shift</a>(teeth, min_teeth=);</code></p>
</blockquote>
<blockquote>
<p><code>shorten = <a href="gears.scad#function-gear_shorten">gear_shorten</a>(teeth1, teeth2, [helical], [profile_shift1], [profile_shift2], [pressure_angle=]);</code></p>
</blockquote>
<blockquote>
<p><code>shorten = <a href="gears.scad#function-gear_shorten_skew">gear_shorten_skew</a>(teeth1, teeth2, helical1, helical2, [profile_shift1], [profile_shift2], [pressure_angle=]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: hinges.scad</h2><a id="user-content-libfile-hingesscad" class="anchor" aria-label="Permalink: LibFile: hinges.scad" href="#libfile-hingesscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Hinges</h3><a id="user-content-section-hinges" class="anchor" aria-label="Permalink: Section: Hinges" href="#section-hinges"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="hinges.scad#module-knuckle_hinge">knuckle_hinge</a>(length, offset, segs, [inner], [arm_height=], [arm_angle=], [fill=], [clear_top=], [gap=], [round_top=], [round_bot=], [knuckle_diam=], [pin_diam=], [pin_fn=], [anchor=], [spin=], [orient=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="hinges.scad#module-living_hinge_mask">living_hinge_mask</a>(l, thick, [layerheight=], [foldangle=], [hingegap=], [$slop=], [anchor=], [spin=], [orient=]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Snap Locks</h3><a id="user-content-section-snap-locks" class="anchor" aria-label="Permalink: Section: Snap Locks" href="#section-snap-locks"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="hinges.scad#module-apply_folding_hinges_and_snaps">apply_folding_hinges_and_snaps</a>(thick, [foldangle=], [hinges=], [snaps=], [sockets=], [snaplen=], [snapdiam=], [hingegap=], [layerheight=], [$slop=]) CHILDREN;</code></p>
</blockquote>
<blockquote>
<p><code><a href="hinges.scad#module-snap_lock">snap_lock</a>(thick, [snaplen=], [snapdiam=], [layerheight=], [foldangle=], [hingegap=], [$slop=], [anchor=], [spin=], [orient=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="hinges.scad#module-snap_socket">snap_socket</a>(thick, [snaplen=], [snapdiam=], [layerheight=], [foldangle=], [hingegap=], [$slop=], [anchor=], [spin=], [orient=]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: joiners.scad</h2><a id="user-content-libfile-joinersscad" class="anchor" aria-label="Permalink: LibFile: joiners.scad" href="#libfile-joinersscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Half Joiners</h3><a id="user-content-section-half-joiners" class="anchor" aria-label="Permalink: Section: Half Joiners" href="#section-half-joiners"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="joiners.scad#functionmodule-half_joiner_clear">half_joiner_clear</a>(l, w, [ang=], [clearance=], [overlap=]) [ATTACHMENTS];</code><br>
<code>vnf = <a href="joiners.scad#functionmodule-half_joiner_clear">half_joiner_clear</a>(l, w, [ang=], [clearance=], [overlap=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="joiners.scad#functionmodule-half_joiner">half_joiner</a>(l, w, [base=], [ang=], [screwsize=], [$slop=]) [ATTACHMENTS];</code><br>
<code>vnf = <a href="joiners.scad#functionmodule-half_joiner">half_joiner</a>(l, w, [base=], [ang=], [screwsize=], [$slop=]);</code></p>
</blockquote>
<blockquote>
<p><code><a href="joiners.scad#functionmodule-half_joiner2">half_joiner2</a>(l, w, [base=], [ang=], [screwsize=])</code><br>
<code>vnf = <a href="joiners.scad#functionmodule-half_joiner2">half_joiner2</a>(l, w, [base=], [ang=], [screwsize=])</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Full Joiners</h3><a id="user-content-section-full-joiners" class="anchor" aria-label="Permalink: Section: Full Joiners" href="#section-full-joiners"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="joiners.scad#module-joiner_clear">joiner_clear</a>(l, w, [ang=], [clearance=], [overlap=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="joiners.scad#module-joiner">joiner</a>(l, w, base, [ang=], [screwsize=], [$slop=]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Dovetails</h3><a id="user-content-section-dovetails" class="anchor" aria-label="Permalink: Section: Dovetails" href="#section-dovetails"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="joiners.scad#module-dovetail">dovetail</a>(gender, w=|width, h=|height, slide|thickness=, [slope=|angle=], [taper=|back_width=], [chamfer=], [r=|radius=], [round=], [extra=], [entry_slot_length=], [$slop=])</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Tension Clips</h3><a id="user-content-section-tension-clips" class="anchor" aria-label="Permalink: Section: Tension Clips" href="#section-tension-clips"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="joiners.scad#module-snap_pin">snap_pin</a>(size, [pointed=], [anchor=], [spin=], [orient]=) [ATTACHMENTS];</code><br>
<code><a href="joiners.scad#module-snap_pin">snap_pin</a>(r=|radius=|d=|diameter=, l=|length=, nub_depth=, snap=, thickness=, [clearance=], [preload=], [pointed=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="joiners.scad#module-snap_pin_socket">snap_pin_socket</a>(size, [fixed=], [fins=], [pointed=], [anchor=], [spin=], [orient=]) [ATTACHMENTS];</code><br>
<code><a href="joiners.scad#module-snap_pin_socket">snap_pin_socket</a>(r=|radius=|d=|diameter=, l=|length=, nub_depth=, snap=, [fixed=], [pointed=], [fins=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="joiners.scad#module-rabbit_clip">rabbit_clip</a>(type, length, width, snap, thickness, depth, [compression=], [clearance=], [lock=], [lock_clearance=], [splineteps=], [anchor=], [orient=], [spin=]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Splines</h3><a id="user-content-section-splines" class="anchor" aria-label="Permalink: Section: Splines" href="#section-splines"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="joiners.scad#module-hirth">hirth</a>(n, ir|id=, or|od=, tooth_angle, [cone_angle=], [chamfer=], [rounding=], [base=], [crop=], [anchor=], [spin=], [orient=]</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: linear_bearings.scad</h2><a id="user-content-libfile-linear_bearingsscad" class="anchor" aria-label="Permalink: LibFile: linear_bearings.scad" href="#libfile-linear_bearingsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Generic Linear Bearings</h3><a id="user-content-section-generic-linear-bearings" class="anchor" aria-label="Permalink: Section: Generic Linear Bearings" href="#section-generic-linear-bearings"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="linear_bearings.scad#module-linear_bearing_housing">linear_bearing_housing</a>(d, l, tab, gap, wall, tabwall, screwsize) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="linear_bearings.scad#module-linear_bearing">linear_bearing</a>(l, od, id, length) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: lmXuu Linear Bearings</h3><a id="user-content-section-lmxuu-linear-bearings" class="anchor" aria-label="Permalink: Section: lmXuu Linear Bearings" href="#section-lmxuu-linear-bearings"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="linear_bearings.scad#module-lmxuu_housing">lmXuu_housing</a>(size, tab, gap, wall, tabwall, screwsize) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="linear_bearings.scad#module-lmxuu_bearing">lmXuu_bearing</a>(size) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: lmXuu Linear Bearing Info</h3><a id="user-content-section-lmxuu-linear-bearing-info" class="anchor" aria-label="Permalink: Section: lmXuu Linear Bearing Info" href="#section-lmxuu-linear-bearing-info"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>diam_len = <a href="linear_bearings.scad#function-lmxuu_info">lmXuu_info</a>(size);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: modular_hose.scad</h2><a id="user-content-libfile-modular_hosescad" class="anchor" aria-label="Permalink: LibFile: modular_hose.scad" href="#libfile-modular_hosescad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Modular Hose Parts</h3><a id="user-content-section-modular-hose-parts" class="anchor" aria-label="Permalink: Section: Modular Hose Parts" href="#section-modular-hose-parts"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="modular_hose.scad#module-modular_hose">modular_hose</a>(size, type, [clearance], [waist_len], [anchor], [spin], [orient]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code>r = <a href="modular_hose.scad#function-modular_hose_radius">modular_hose_radius</a>(size, [outer]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: nema_steppers.scad</h2><a id="user-content-libfile-nema_steppersscad" class="anchor" aria-label="Permalink: LibFile: nema_steppers.scad" href="#libfile-nema_steppersscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Motor Models</h3><a id="user-content-section-motor-models" class="anchor" aria-label="Permalink: Section: Motor Models" href="#section-motor-models"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="nema_steppers.scad#module-nema_stepper_motor">nema_stepper_motor</a>(size, h, shaft_len, [$slop=], ...) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Masking Modules</h3><a id="user-content-section-masking-modules" class="anchor" aria-label="Permalink: Section: Masking Modules" href="#section-masking-modules"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="nema_steppers.scad#module-nema_mount_mask">nema_mount_mask</a>(size, depth, l, [$slop], ...);</code></p>
</blockquote>
<div class="markdown-heading"><h3 class="heading-element">Section: Functions</h3><a id="user-content-section-functions-1" class="anchor" aria-label="Permalink: Section: Functions" href="#section-functions-1"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code>info = <a href="nema_steppers.scad#function-nema_motor_info">nema_motor_info</a>(size);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: polyhedra.scad</h2><a id="user-content-libfile-polyhedrascad" class="anchor" aria-label="Permalink: LibFile: polyhedra.scad" href="#libfile-polyhedrascad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Polyhedra</h3><a id="user-content-section-polyhedra" class="anchor" aria-label="Permalink: Section: Polyhedra" href="#section-polyhedra"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="polyhedra.scad#module-regular_polyhedron">regular_polyhedron</a>([name],[index=],[type=],[faces=],[facetype=],[hasfaces=],...) [CHILDREN];</code><br>
<code><a href="polyhedra.scad#module-regular_polyhedron">regular_polyhedron</a>(..., [or=|r=|d=],[ir=],[mr=],[side=],[facedown=],[anchor=], ...) [CHILDREN];]</code><br>
<code><a href="polyhedra.scad#module-regular_polyhedron">regular_polyhedron</a>(..., [draw=], [rounding=], [stellate=], [repeat=], [rotate_children=]) [CHILDREN];</code><br>
<code><a href="polyhedra.scad#module-regular_polyhedron">regular_polyhedron</a>("trapezohedron", [longside=],[h=], ...) [CHILDREN];</code></p>
</blockquote>
<blockquote>
<p><code>info = <a href="polyhedra.scad#function-regular_polyhedron_info">regular_polyhedron_info</a>(info, ...);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: sliders.scad</h2><a id="user-content-libfile-slidersscad" class="anchor" aria-label="Permalink: LibFile: sliders.scad" href="#libfile-slidersscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Modules</h3><a id="user-content-section-modules" class="anchor" aria-label="Permalink: Section: Modules" href="#section-modules"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="sliders.scad#module-slider">slider</a>(l, w, h, [base=], [wall=], [ang=], [$slop=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="sliders.scad#module-rail">rail</a>(l, w, h, [chamfer=], [ang=]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: tripod_mounts.scad</h2><a id="user-content-libfile-tripod_mountsscad" class="anchor" aria-label="Permalink: LibFile: tripod_mounts.scad" href="#libfile-tripod_mountsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section:</h3><a id="user-content-section" class="anchor" aria-label="Permalink: Section:" href="#section"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="tripod_mounts.scad#module-manfrotto_rc2_plate">manfrotto_rc2_plate</a>([chamfer],[anchor],[orient],[spin]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: walls.scad</h2><a id="user-content-libfile-wallsscad" class="anchor" aria-label="Permalink: LibFile: walls.scad" href="#libfile-wallsscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Walls</h3><a id="user-content-section-walls" class="anchor" aria-label="Permalink: Section: Walls" href="#section-walls"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="walls.scad#module-sparse_wall">sparse_wall</a>(h, l, thick, [maxang=], [strut=], [max_bridge=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="walls.scad#module-sparse_wall2d">sparse_wall2d</a>(size, [maxang=], [strut=], [max_bridge=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="walls.scad#module-sparse_cuboid">sparse_cuboid</a>(size, [dir], [maxang=], [struct=]</code></p>
</blockquote>
<blockquote>
<p><code><a href="walls.scad#module-hex_panel">hex_panel</a>(shape, wall, spacing, [frame=], [bevel=], [bevel_frame=], [h=|height=|l=|length=], [anchor=], [orient=], [spin=])</code></p>
</blockquote>
<blockquote>
<p><code><a href="walls.scad#module-corrugated_wall">corrugated_wall</a>(h, l, thick, [strut=], [wall=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="walls.scad#module-thinning_wall">thinning_wall</a>(h, l, thick, [ang=], [braces=], [strut=], [wall=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="walls.scad#module-thinning_triangle">thinning_triangle</a>(h, l, thick, [ang=], [strut=], [wall=], [diagonly=], [center=]) [ATTACHMENTS];</code></p>
</blockquote>
<blockquote>
<p><code><a href="walls.scad#module-narrowing_strut">narrowing_strut</a>(w, l, wall, [ang=]) [ATTACHMENTS];</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: wiring.scad</h2><a id="user-content-libfile-wiringscad" class="anchor" aria-label="Permalink: LibFile: wiring.scad" href="#libfile-wiringscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section: Modules</h3><a id="user-content-section-modules-1" class="anchor" aria-label="Permalink: Section: Modules" href="#section-modules-1"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="wiring.scad#module-wire_bundle">wire_bundle</a>(path, wires, [wirediam], [rounding], [wirenum=], [corner_steps=]);</code></p>
</blockquote>
<div class="markdown-heading"><h2 class="heading-element">LibFile: hooks.scad</h2><a id="user-content-libfile-hooksscad" class="anchor" aria-label="Permalink: LibFile: hooks.scad" href="#libfile-hooksscad"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<div class="markdown-heading"><h3 class="heading-element">Section:</h3><a id="user-content-section-1" class="anchor" aria-label="Permalink: Section:" href="#section-1"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
<blockquote>
<p><code><a href="hooks.scad#module-ring_hook">ring_hook</a>(base_size, hole_z, or, od=, [ir=], [hole=], [rounding=], [fillet=], [hole_rounding=], [anchor=], [spin=], [orient=])</code></p>
</blockquote>

              </div>
