import { assets } from "../assets/assets";

function Footer() {
  return (
    <div className="flex items-center justify-between gap-4 py-3 mt-20">
      <img src={assets.logo} width={150} alt="logoo" />
      <p className="flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden">
        Copyright @abanwachinaza@gmail.com | All right reserved.
      </p>
      <div className="flex gap-2.5">
        <img src={assets.facebook_icon} width={35} alt="facebook_icon" />
        <img src={assets.twitter_icon} width={35} alt="twitter_icon" />
        <img src={assets.instagram_icon} width={35} alt="instagram_icon" />
      </div>
    </div>
  );
}

export default Footer;
