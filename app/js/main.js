import '../css/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import * as dat from "dat.gui";
import gsap from "gsap";

export default class Sketch{

  constructor(options){
    //Setting Size of Content 
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

   //Scene
    this.scene = new THREE.Scene();
    //camera
    this.camera = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,100);
    this.camera.position.z = 1;

     //setup render
     this.renderer = new THREE.WebGLRenderer({antialias:true});
     this.renderer.setSize(this.width,this.height);
     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
     this.renderer.setClearColor(0xeeeeee, 1); 

     //Attach canvas on dom
     this.container.appendChild(this.renderer.domElement);
    
    //orbit controls
     this.controls = new OrbitControls(this.camera,this.renderer.domElement);
     this.controls.enableDamping = true;
        
     //Animation Setting
      this.time = new THREE.Clock();
      this.isPlaying = true;

    //function 
    this.addObject();
    this.resize();
    this.setupResize();
    this.render();
    this.settings()
 
  }

  //debug

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  /*
  ** Resize
  */
  setupResize(){
    window.addEventListener('resize',this.resize.bind(this))
  }

  resize(){
   
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      this.renderer.setSize(this.width,this.height);
      this.camera.aspect = this.width/this.height;
      this.camera.updateProjectionMatrix();
  }
  /*
  ** Object
  */
  addObject(){
    this.geometry = new THREE.BoxGeometry(0.2,0.2,0.2);
    this.material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(this.geometry,this.material);
    this.scene.add(this.mesh);

  }

  /*
  ** Render Animation;
  **/

  stop() {
    this.isPlaying = false;
  }

  play() {
    if(!this.isPlaying){
      this.render()
      this.isPlaying = true;
    }
  }


  render(){
    if (!this.isPlaying) return;
    const elapsTime = this.time.getElapsedTime();
    this.mesh.rotation.x = Math.PI*2 * elapsTime ;
    this.controls.update(); 
    window.requestAnimationFrame(this.render.bind(this)); 
    this.renderer.render(this.scene, this.camera);      
  }

};

new Sketch({
  dom:document.getElementById('container')
})