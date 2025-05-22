export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t bg-[#112e51] text-white'>
      <div className='border-t border-white/20 py-8 text-center text-sm text-white'>
        <p>© {currentYear} PassGo. All rights reserved.</p>
      </div>
    </footer>
  );
}
