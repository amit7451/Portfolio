# 3D Portfolio Performance Analysis

Based on a comprehensive scan of the `portfolio_main` 3D environment, the following areas contribute significantly to high compute power usage, rendering latency, and memory bloat.

## 1. Excessive Shadow Casting and Receiving
Shadows in WebGL are computationally expensive. Currently, nearly every object in the scene—including tiny decorative items, books, stool legs, and individual toy figurines—has both `castShadow` and `receiveShadow` enabled. 

**Impact:**
- The renderer has to compute complex depth maps for hundreds of overlapping geometries every frame.
- **Fix:** Disable shadows on small, static, or hidden objects (e.g., books, wires, back faces of shelves). Only enable shadows on large, prominent objects (walls, desks, main characters).

## 2. Uninstanced Complex Geometries (Toy Figurines & Books)
The `DeskGroup`, `WallDecorGroup`, and `ProjectsRoom` load multiple copies of complex models (like the Toy Figurines) or generate dozens of distinct primitive meshes (like the `RandomBookStack` or `BinderGroup`).

**Impact:**
- Each distinct mesh requires a separate draw call submitted to the GPU.
- **Fix:** 
    - Use `InstancedMesh` for repeated objects (like books, binders, and sticky notes). This reduces 50 draw calls down to 1 hardware-accelerated draw call.
    - If importing GLTF models (Figurines), ensure `gltfjsx` instances are used so geometry is shared in memory.

## 3. Redundant Texture Loading and Memory Bloat
Across `ContactsRoom.tsx`, `AboutRoom.tsx`, and `ProjectsRoom.tsx`, the same high-resolution textures (`plaster.jpg`, `ceiling_interior.jpg`, `floor.jpg`) are loaded independently via `useTexture` in each component. 

**Impact:**
- `useTexture` caches internally, but cloning and reconfiguring them across different files causes multiple high-res textures to be sent to the GPU, eating VRAM.
- Anisotropy is set to `16` on almost every texture, which is the maximum anisotropic filtering level and is very intensive on mobile devices.
- **Fix:** 
    - Create a central `TextureManager` or context to load, configure, and share a single instance of the ground/wall/ceiling materials.
    - Lower Anisotropy to `4` or `8` (visually indistinguishable in most cases but much cheaper).

## 4. Unoptimized Lighting Overlap
There is a massive amount of overlapping lighting. `BuildingScene.tsx` lighting mixes with individual room lighting (`AboutRoom.tsx` alone has 4 point lights, `ContactsRoom.tsx` has another 5). 

**Impact:**
- In standard WebGL, every material calculates its reaction to *every* active light in the scene. 20+ active lights across the building will cause exponential shader calculation overhead.
- **Fix:** 
    - Limit the number of active lights. 
    - Consider "Baking" lighting into the textures for static rooms using tools like Blender, reducing the need for real-time lights entirely.

## 5. Geometry Complexity without LOD (Level of Detail)
The `WallText` dynamically generates 3D text using `Text3D` with `curveSegments={12}`.

**Impact:**
- `curveSegments={12}` on a 3D font creates thousands of vertices per letter. Multiplying this by 4 rooms with multiple titles causes severe vertex bloat.
- **Fix:** Reduce `curveSegments` to `2` or `4`. The difference is rarely noticeable from a distance, but the polygon count drops by 80%.

## 6. CSS3D and HTML Portal Overhead
The portfolio successfully uses `@react-three/drei`'s `<Html>` wrapper. However, constantly recalculating `Math.max(0, (currentOffset - 0.88) * 16)` inside a `ref` on every frame (via `useFrame` or render loops) can cause main-thread UI stuttering.

**Impact:**
- Forces continuous DOM reflows over the WebGL canvas.
- **Fix:** Limit opacity updates, or use CSS transitions triggered by a state change instead of per-frame math mapping.

## Recommended Immediate Action Items:
1. **Shadow Sweep:** Turn off `castShadow` on 80% of tiny decorative objects.
2. **Texture Context:** Load plaster/floor/ceiling once in `BuildingScene` and pass them as props.
3. **Decrease Text Geometry:** Change `curveSegments={12}` to `curveSegments={4}` in `WallText.tsx`.
4. **Light Culling:** Reduce overlapping point lights.
