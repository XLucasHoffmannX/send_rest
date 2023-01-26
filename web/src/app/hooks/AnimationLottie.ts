const AnimationLottie = (file: {}) => {
    return {
        loop: true,
        autoplay: true,
        animationData: file,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
}

export default AnimationLottie;