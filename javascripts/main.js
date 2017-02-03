console.log('This would be the main JS file.');
var background = (function(){
  
  var scene,camera,renderer,t=0,shapes=[];
  var mouseX = 0, mouseY = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  var t = 0;
  
  var options = {
    type: -1, //  -1: random,  0: boxes,  1: spheres,  2:  pyramids
    n: 100,
    mainColor: 0xfcfcfc,
    paused:false
  }
  
  function init(userOptions){
  
    extend(options, userOptions)
    
    scene = new THREE.Scene();
  
    scene.fog = new THREE.Fog( options.mainColor, 7, 15 );
  
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, .01, 1000);
    camera.position.set(0,0,2);
  

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(options.mainColor);
    renderer.domElement.style.position="fixed";
    renderer.domElement.style.top=0;
    renderer.domElement.style.left=0;
    document.body.appendChild(renderer.domElement);
  
    window.addEventListener("resize", function(){
      var WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    });
  
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    
    generateMainObjects();
    
    for(var i =0;i<options.n;i++){
      var type = options.type == -1?Math.floor(Math.random() * 3) + 0 : options.type;
      generateShape(type)
    }
    
    
    render();
    
  }
  
  function generateMainObjects(){
    var light = new THREE.HemisphereLight(0xDCA80E, 0xdedede, 1);
    light.castShadow = true;
    scene.add(light)
  
    //grid
    var grid = new THREE.GridHelper(50,1);
    grid.position.set(0,-2,0);
    grid.rotation.x=0;
 //   grid.setColors(0xffffff,0xffffff); -deprecated
    grid.material.transparent = true
    grid.material.opacity = .5
    scene.add(grid);
    console.log(grid.material)
    
    // mask plane
    var groundGeom = new THREE.BoxGeometry(50,.1,50)
    var material = new THREE.MeshBasicMaterial({color: options.mainColor });
    var ground = new THREE.Mesh(groundGeom, material);
    ground.castShadow = false;
    ground.receiveShadow = true;
    ground.position.set(0,-2.1,0); 
    scene.add(ground);
  }
  
  function generateShape(type){
    
    //edit material
    var material = new THREE.MeshLambertMaterial ({color: 0xffffff, transparent:true});
    
        
    switch(type){
      case 0:
        var geometry = new THREE.BoxGeometry( 1,1,1 );
      break;
      case 1:
        var geometry = new THREE.SphereGeometry( .5, 20,20 );
      break;
      case 2:
        var geometry = new THREE.TetrahedronGeometry( 1);
      break;
        
    } 
 
      var shape = new THREE.Mesh(geometry, material);
      shape.rotation.x=shape.rotation.y=shape.rotation.z=Math.random() * (360 - 0) + 0
      shape.position.set((Math.random() * (25 +25) -25),-(Math.random() * (4 - 3) + 3),-(Math.random() * (11- 0) + 0));
      shape.velocity = Math.random()/100;
      scene.add(shape);
      shapes.push(shape)

   
    
  }
  
  function render(){
    camera.rotation.y = -1/8*Math.sin(.5*t);
    camera.rotation.x = 1/8*Math.cos(.5*t);
 
    for(var i =0; i<shapes.length;i++){
      if(shapes[i].material.opacity<0){
        if(!options.paused){
          shapes[i].material.opacity =1;
          shapes[i].position.y=-4;
          shapes[i].position.set((Math.random() * (25 +25) -25),-(Math.random() * (4 - 3) + 3),-(Math.random() * (11- 0) + 0));
        }
        
      }else{
        shapes[i].position.y +=shapes[i].velocity;
        shapes[i].material.opacity -=shapes[i].velocity/5;
        shapes[i].rotation.x+=shapes[i].velocity
        shapes[i].rotation.y+=shapes[i].velocity
        shapes[i].rotation.z+=shapes[i].velocity

      }
  
    }
    t+=.01;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  
  function onDocumentMouseMove( event ) {
		mouseX = ( event.clientX - windowHalfX );
		mouseY = ( event.clientY - windowHalfY );
	}
  
  function extend(a, b){
	    for(var key in b)	if(b.hasOwnProperty(key))  a[key] = b[key];
		return a;
	}
  
  function pausePlay(){
    options.paused = ! options.paused
  }
  
  
  return {
    init:init,
    pausePlay: pausePlay
  }
  
})();

background.init({n:100})

background.init() 
