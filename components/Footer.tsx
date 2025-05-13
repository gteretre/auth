function Footer() {
  return (
    <footer
      id="footer"
      className="select-none bg-primary px-8 py-4 text-white shadow-md"
    >
      <div className="mx-auto flex w-full flex-row justify-between">
        <div className="pointer-events-none flex items-center gap-2">
          <span className="font-semibold">
            © Michał Kowalski, Eryk Tucki {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
