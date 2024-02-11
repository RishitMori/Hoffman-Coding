import { auth, signInWithGooglePopup } from "../utils/authLogin";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles

function Login() {
    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        console.log("rishit", auth)
        console.log("prachi", response);
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-center">
                <button className="btn btn-primary" onClick={logGoogleUser}>
                    Sign In With Google
                </button>
            </div>
        </div>
    );
}

export default Login;
