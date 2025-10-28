const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-4 px-6">
      <div className="flex items-center justify-center text-sm text-muted-foreground">
        <span>Designed and developed by </span>
        <a 
          href="https://www.linkedin.com/in/pulkit-chaudhary" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-1 text-primary hover:underline font-medium"
        >
          Pulkit Chaudhary
        </a>
      </div>
    </footer>
  );
};

export default Footer;
