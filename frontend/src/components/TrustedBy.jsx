const TrustedBy = () => {
  const logos = [
    { name: 'Retool', src: '/logos/retool.png' },
    { name: 'Zapier', src: '/logos/zapier.png' },
    { name: 'Workato', src: '/logos/workato.png' },
    { name: 'AWS Lambda', src: '/logos/aws-lambda.png' },
    { name: 'Google Apps Script', src: '/logos/google-apps-script.png' },
  ];

  return (
    <div className="bg-neutral-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-lg font-semibold text-neutral-600 mb-6">
          Built Using Industry-Leading Tools
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="bg-white rounded-lg shadow-sm px-6 py-3 flex items-center justify-center h-16"
            >
              <img src={logo.src} alt={logo.name} className="h-8 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustedBy; 