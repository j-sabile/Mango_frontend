import { Modal } from "react-bootstrap";

function SpinUpNotify({ show, onHide }) {
  const { showWait, showLoaded, showError } = show;
  const { setShowWait, setShowLoaded, setShowError } = onHide;

  return (
    <>
      <Modal show={showWait} onHide={() => setShowWait(false)} centered="true">
        <div className="d-flex flex-column justify-content-between align-items-center p-5">
          <img src="mango_icon.png" className="align-self-center" alt="mango icon" height="65px" width="65px" />
          <h4 className="text-center mt-2">Please wait for a moment!</h4>
          <p className="text-center mt-3">We apologize for the brief delay you may experience when first visiting our website. Our system utilizes no-cost services, which require a moment to start up.</p>
          <p className="text-center mb-3">However, we assure you that we'll be up and running shortly. Thank you for your understanding!</p>
        </div>
      </Modal>
      <Modal show={showLoaded} onHide={() => setShowLoaded(false)} centered="true">
        <div className="d-flex flex-column justify-content-between align-items-center p-5">
          <img src="mango_icon.png" className="align-self-center" alt="mango icon" height="65px" width="65px" />
          <h4 className="text-center mt-2">We're up and running!</h4>
          <p className="text-center my-3">Good news! Our website is now up and running smoothly. Thank you for your patience during the startup process. Enjoy exploring our site!</p>.
        </div>
      </Modal>
      <Modal show={showError} onHide={() => setShowError(false)} centered="true">
        <div className="d-flex flex-column justify-content-between align-items-center p-5">
          <img src="mango_icon.png" className="align-self-center" alt="mango icon" height="65px" width="65px" />
          <h4 className="text-center mt-2">Oops! We're having technical difficulties.</h4>
          <p className="text-center my-3">Sorry for the inconvenience! We're having technical difficulties but rest assured, we're working on a fix. Please try again later. Thank you for your understanding!</p>
        </div>
      </Modal>
    </>
  );
}

export default SpinUpNotify;
