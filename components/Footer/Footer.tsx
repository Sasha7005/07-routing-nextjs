import css from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Oleksandr Basarab</p>
          <p>
            Contact us:
            <a href="mailto:basarab.o@icloud.com">basarab.o@icloud.com </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
