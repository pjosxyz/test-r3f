import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Sky } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense } from "react";
import { useControls } from "leva";
import { useState, useEffect, useRef } from "react";

function App() {
  return (
    <>
      <div className="wrapper">
        <Canvas camera={{ position: [0, 3, 10], fov: 75 }}>
          <Experience />
        </Canvas>
      </div>
    </>
  );
}

function Experience() {
  // const { rotation, rotationX } = useControls({
  //   rotation: {
  //     min: 0,
  //     max: 10,
  //   },
  //   rotationX: {
  //     min: 0,
  //     max: 10,
  //   },
  // });

  // const { scene, camera } = useThree();

  return (
    <>
      <Sky />
      <OrbitControls />
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 8, 5]} intensity={1} />
      <Suspense>
        <Physics>
          <RigidBody colliders="ball" type="dynamic">
            <Ball />
          </RigidBody>
          <Platform />
        </Physics>
      </Suspense>
    </>
  );
}

function Ball() {
  const ball = useGLTF("./models/ball.glb");

  const ballRef = useRef();
  if (ballRef.current) {
  }

  useEffect(() => {
    console.log(ballRef.current);
  }, []);

  useFrame((state) => {
    // 1. Get world position of ball
    // 2. Update camera position to follow ball
    // 3. Update camera rotation to follow forward vec(?) of ball
  });

  return <primitive object={ball.scene} dispose={null} ref={ballRef} />;
}

function Platform() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  // const [aPressed, setAPressed] = useState(false);

  const { scene } = useGLTF("./models/platform.glb");
  const platformRef = useRef();

  function isDeadZone(axes, controlObject) {
    return controlObject.axes[axes] < 0.1 && controlObject.axes[axes] > -0.1;
  }

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    const controllers = navigator.getGamepads()[1]; // bad idea?

    if (controllers !== null) {
      // ignore movement in a deadzone area
      !isDeadZone(0, controllers) ? setX(controllers.axes[0]) : setX(0);
      !isDeadZone(1, controllers) ? setY(controllers.axes[1]) : setY(0);
    }

    platformRef.current.setRotation({
      w: 1,
      x: y,
      y: 0,
      z: x,
    });
  });

  return (
    <RigidBody type="kinematicPosition" colliders="trimesh" ref={platformRef}>
      <primitive object={scene} dispose={null} />
    </RigidBody>
  );
}

export default App;
