
function Footer () {

    function goToTop () {
        window.scrollTo(0, 0);
    }

    return (
        <footer className="text-muted bg-light">
                <div className="container">
                <p className="float-right">
                    <button className="btn btn-outline-primary" onClick={goToTop}>Back to top</button>
                </p>
                <p>Website Footer</p>
            </div>
      </footer>
    )
}

export default Footer;