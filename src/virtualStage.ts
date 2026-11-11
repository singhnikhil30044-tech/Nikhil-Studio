import * as THREE from 'three';
import * as xb from 'xrblocks';

export class StudioVirtualStageScript extends xb.Script {
  private keyLight!: THREE.SpotLight;
  private fillLight!: THREE.SpotLight;
  private rimLight!: THREE.PointLight;
  private backdropMesh!: THREE.Mesh;
  private studioGroup = new THREE.Group();
  private vuMeters: THREE.Mesh[] = [];

  init() {
    this.add(this.studioGroup);

    // Ambient studio base lighting
    const hemi = new THREE.HemisphereLight(0xffeedd, 0x111122, 1.2);
    this.add(hemi);

    // Key Light (Profoto softbox)
    this.keyLight = new THREE.SpotLight(0xfff3db, 4);
    this.keyLight.position.set(-2, 3.2, 0.5);
    this.keyLight.angle = Math.PI / 4;
    this.keyLight.penumbra = 0.5;
    this.studioGroup.add(this.keyLight);

    // Fill Light
    this.fillLight = new THREE.SpotLight(0xd4af37, 2.5);
    this.fillLight.position.set(2.2, 2.8, 0.8);
    this.fillLight.angle = Math.PI / 3;
    this.studioGroup.add(this.fillLight);

    // Rim / Hair Light (Golden accent)
    this.rimLight = new THREE.PointLight(0xffb703, 3, 6);
    this.rimLight.position.set(0, 2.8, -1.8);
    this.studioGroup.add(this.rimLight);

    // Build the Studio Set
    this.buildBackdrop();
    this.buildLightingRig();
    this.buildCameraRig();
    this.buildAudioBooth();
    this.buildAudioMixingConsole();

    // Position overall studio in front of user in XR/3D
    this.studioGroup.position.set(0, 0, -2.5);
  }

  private buildBackdrop() {
    // Curved Cyclorama wall
    const backdropGeo = new THREE.CylinderGeometry(4.5, 4.5, 4, 32, 1, true, -Math.PI / 2, Math.PI);
    const backdropMat = new THREE.MeshStandardMaterial({
      color: 0x0c0e14,
      roughness: 0.85,
      metalness: 0.1,
      side: THREE.BackSide,
    });
    this.backdropMesh = new THREE.Mesh(backdropGeo, backdropMat);
    this.backdropMesh.position.set(0, 2, 0);
    this.backdropMesh.rotation.y = Math.PI;
    this.studioGroup.add(this.backdropMesh);

    // Glossy Dark Studio Floor
    const floorGeo = new THREE.CircleGeometry(4.2, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x07080b,
      roughness: 0.25,
      metalness: 0.7,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.studioGroup.add(floor);

    // Golden studio rim ring
    const ringGeo = new THREE.RingGeometry(4.1, 4.18, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    this.studioGroup.add(ring);
  }

  private buildLightingRig() {
    // Softbox 1 on Left
    const softboxGeo = new THREE.BoxGeometry(0.6, 0.9, 0.35);
    const softboxMat = new THREE.MeshStandardMaterial({ color: 0x111118, roughness: 0.5 });
    const softboxMesh = new THREE.Mesh(softboxGeo, softboxMat);
    softboxMesh.position.set(-1.8, 2.2, -0.6);
    softboxMesh.rotation.y = 0.5;
    softboxMesh.rotation.x = 0.2;

    // Diffuser front
    const diffuserGeo = new THREE.PlaneGeometry(0.56, 0.86);
    const diffuserMat = new THREE.MeshBasicMaterial({ color: 0xfffaea });
    const diffuser = new THREE.Mesh(diffuserGeo, diffuserMat);
    diffuser.position.z = 0.18;
    softboxMesh.add(diffuser);

    // Stand
    const standGeo = new THREE.CylinderGeometry(0.02, 0.025, 2.2, 16);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(-1.8, 1.1, -0.6);

    this.studioGroup.add(softboxMesh, stand);
  }

  private buildCameraRig() {
    const camGroup = new THREE.Group();
    camGroup.position.set(0.8, 1.3, -0.8);
    camGroup.rotation.y = -0.3;

    // Cinema Camera Body (Sony FX6 style)
    const bodyGeo = new THREE.BoxGeometry(0.24, 0.22, 0.35);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x181a20, metalness: 0.6, roughness: 0.4 });
    const camBody = new THREE.Mesh(bodyGeo, bodyMat);

    // Cinema Prime Lens
    const lensGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.25, 24);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0d, metalness: 0.9, roughness: 0.1 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 0, -0.25);
    camBody.add(lens);

    // Golden focal ring on lens
    const goldRingGeo = new THREE.TorusGeometry(0.072, 0.005, 12, 32);
    const goldRingMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
    const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
    goldRing.position.set(0, 0, -0.22);
    camBody.add(goldRing);

    // Matte Box
    const mbGeo = new THREE.BoxGeometry(0.24, 0.2, 0.08);
    const mbMat = new THREE.MeshStandardMaterial({ color: 0x0f1115 });
    const matteBox = new THREE.Mesh(mbGeo, mbMat);
    matteBox.position.set(0, 0, -0.38);
    camBody.add(matteBox);

    // Monitor Screen on top
    const screenGeo = new THREE.BoxGeometry(0.22, 0.14, 0.02);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.2, 0.02);
    screen.rotation.x = -0.3;
    camBody.add(screen);

    // Tripod Legs
    const tripodLegGeo = new THREE.CylinderGeometry(0.015, 0.02, 1.35, 8);
    const tripodMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8 });
    
    const leg1 = new THREE.Mesh(tripodLegGeo, tripodMat);
    leg1.position.set(0, -0.65, 0.25);
    leg1.rotation.x = 0.22;

    const leg2 = new THREE.Mesh(tripodLegGeo, tripodMat);
    leg2.position.set(-0.25, -0.65, -0.2);
    leg2.rotation.z = -0.22;
    leg2.rotation.x = -0.15;

    const leg3 = new THREE.Mesh(tripodLegGeo, tripodMat);
    leg3.position.set(0.25, -0.65, -0.2);
    leg3.rotation.z = 0.22;
    leg3.rotation.x = -0.15;

    camGroup.add(camBody, leg1, leg2, leg3);
    this.studioGroup.add(camGroup);
  }

  private buildAudioBooth() {
    const micGroup = new THREE.Group();
    micGroup.position.set(-0.7, 1.4, -1.2);

    // Mic Stand
    const standGeo = new THREE.CylinderGeometry(0.012, 0.015, 1.4, 12);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.85 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.y = -0.7;

    // Heavy round base
    const baseGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24);
    const base = new THREE.Mesh(baseGeo, standMat);
    base.position.y = -1.38;

    // Vintage Neumann style microphone body
    const micGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.18, 20);
    const micMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 });
    const mic = new THREE.Mesh(micGeo, micMat);

    // Mic grille
    const grilleGeo = new THREE.SphereGeometry(0.035, 16, 16);
    const grilleMat = new THREE.MeshStandardMaterial({ color: 0xf5eed3, metalness: 0.9, roughness: 0.2, wireframe: true });
    const grille = new THREE.Mesh(grilleGeo, grilleMat);
    grille.position.y = 0.09;
    mic.add(grille);

    // Pop filter circle
    const popFilterGeo = new THREE.TorusGeometry(0.07, 0.005, 12, 32);
    const popFilterMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const popFilter = new THREE.Mesh(popFilterGeo, popFilterMat);
    popFilter.position.set(0, 0.05, 0.12);

    micGroup.add(stand, base, mic, popFilter);
    this.studioGroup.add(micGroup);
  }

  private buildAudioMixingConsole() {
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(0, 0.85, -0.4);

    // Desk Surface
    const deskGeo = new THREE.BoxGeometry(1.6, 0.06, 0.7);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x161822, metalness: 0.4, roughness: 0.5 });
    const desk = new THREE.Mesh(deskGeo, deskMat);

    // Golden trim edge
    const trimGeo = new THREE.BoxGeometry(1.62, 0.02, 0.02);
    const trimMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(0, 0.03, 0.35);
    desk.add(trim);

    // Mixing Console Panel
    const boardGeo = new THREE.BoxGeometry(1.2, 0.05, 0.45);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x0c0e14, metalness: 0.7, roughness: 0.3 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(0, 0.05, 0.05);
    board.rotation.x = -0.15;
    desk.add(board);

    // Glowing VU meters
    for (let i = 0; i < 8; i++) {
      const vuGeo = new THREE.BoxGeometry(0.02, 0.08, 0.01);
      const vuMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x22c55e : 0xeab308
      });
      const vu = new THREE.Mesh(vuGeo, vuMat);
      vu.position.set(-0.45 + i * 0.13, 0.08, -0.1);
      board.add(vu);
      this.vuMeters.push(vu);
    }

    consoleGroup.add(desk);
    this.studioGroup.add(consoleGroup);
  }

  setBackdropColor(hex: number) {
    if (this.backdropMesh && this.backdropMesh.material instanceof THREE.MeshStandardMaterial) {
      this.backdropMesh.material.color.setHex(hex);
    }
  }

  setKeyLightIntensity(val: number) {
    if (this.keyLight) {
      this.keyLight.intensity = val;
    }
  }

  update() {
    // Animate glowing audio meters on mixing board
    const time = performance.now() * 0.005;
    this.vuMeters.forEach((vu, idx) => {
      const scale = 0.5 + 0.5 * Math.sin(time * 2 + idx * 1.2);
      vu.scale.y = Math.max(0.2, scale);
    });

    // Subtle gentle float
    this.rimLight.intensity = 2.5 + Math.sin(time) * 0.6;
  }
}
