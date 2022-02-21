import Head from "next/head";
import Image from "next/image";
import {Header} from "../../../components/Header";
import {Hero} from "../../../components/Hero";
import {DataCard} from "../../../components/DataCard";
import {Section} from "../../../components/Section";
import {Timeline} from "../../../components/Timeline";
import {MemberCard} from "../../../components/MemberCard";
import {Footer} from "../../../components/Footer";
import truck from "../../../public/banner.png";
import table from "../../../public/whipped_creamdao.png";
import {Details} from "../../../components/Details";
import AliceCarousel from "react-alice-carousel";
import {readdirSync} from "fs";
import path from "path";

const artworks = ["/transparent/0.png",
  "/transparent/1.png",
  "/transparent/2.png",
  "/transparent/3.png",
  "/transparent/4.png",
  "/transparent/5.png",
  "/transparent/6.png",
  "/transparent/7.png",
  "/transparent/8.png",
  "/transparent/9.png"];
export async function getServerSideProps() {
  const dirRelativeToPublicFolder = 'artwork'

  const dir = path.resolve('./public', dirRelativeToPublicFolder);

  const filenames = readdirSync(dir);

  const artworks = filenames.map((name:string) => path.join('/', dirRelativeToPublicFolder, name))

  return {
    props: {artworks}, // will be passed to the page component as props
  }
}
export default function Home({artworks}:{artworks:string[]}) {
  return (
    <>
      <Head>
        <title>Waffle Social Club</title>
      </Head>
      <Header home={true}/>
      <Hero artworks={artworks}/>
      <Section title={'WELCOME TO THE WAFFLE CLUB'} flex>
        <div
          style={{
            gap: '2rem',
            display: "flex",
            flexDirection: 'column',
            justifyContent: "space-between",
            alignItems: "center"
          }}>
          <p>Waffle Club is a collection of 4343 delicious Waffle NFTs - unique and delicious crypto-art, freshly
            baked
            on the Solana blockchain. Made with hand-picked ingredients to offer high quality products. It’s best to
            eat
            them now when it’s still warm. Go treat yourself!
          </p>
          <p>
            Lekker!
          </p>
          <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              style={{
                background: '#B8202E',
                color: '#f5d8ad',
                padding: '12px 16px',
                borderRadius: '20px',
                fontWeight: 'bold'
              }}
              href="/niet/publiek/roadmap.deck">Check the roadmap</a>
            <a
              style={{
                color: '#B8202E',
                background: '#f5d8ad',
                padding: '12px 16px',
                borderRadius: '20px',
                fontWeight: 'bold'
              }}
              href="#collection">Mint coming soon</a>
          </div>
        </div>
        <Image
          src={truck}
          alt=""
          layout={"responsive"}
        />
      </Section>

      <Section title={'Statistics & Data'}>
        <div style={{
          display: "grid",
          gridTemplateColumns: 'repeat( auto-fit, minmax(100px, 1fr) )',
          gap: '2rem',
          alignItems: 'center',
          maxWidth: '100%',
          fontSize: '1.3rem'
        }}>
          <DataCard value={'4444'} label={'Waffles'}/>
          <DataCard value={'4200'} label={'Available'}/>
          <DataCard value={'375g'} label={'Milk'}/>
          <DataCard value={'140+'} label={'Unique Traits'}/>
          <DataCard value={'TBA'} label={'Mint Date'}/>
          <DataCard value={'2'} label={'Solana'}/>
        </div>
      </Section>
      <Section title={'Roadmap'} id={"roadmap"}>
        <p>Inspired by BAYC, the Waffle grants you an exclusive membership to the private Waffle Club, giving you
          decisional power in the WaffleDAO* and access to increasing benefits and projects.
        </p>
        <p>
          The plan is to draw together the roadmap path.
        </p>
        <Timeline/>
      </Section>
      <Section title={'THE PRIVATE UNDERGROUND CLUB'} flex>
        <div>
          <p>
            Owning your waffle, it’s not only an avatar and a provably-rare piece of art, it’s also an exclusive
            membership to a 4000+ members private club.
          </p>
          <p>
            Events will be cooked to bring the community closer. Ideas and plans are already boiling in our heads: a
            permanent gallery to showcase and deal our NFTs, an underground and secret (not so secret anymore heh)
            fight
            club for members to meet-up, the privatization of the Atomium for member-exclusive parties, and much more
            …
            What we do is what you want as the WaffleDAO.
          </p>

        </div>
        <Image
          layout={"responsive"}
          src={table}
          alt=""
        />
      </Section>
      <Section title={'NFT TRAIT RARITY'}>
        <p>
          Although all waffles will be delightful. Some say that a waffle is definitely more savory with some whipped
          cream or chopped fruits. Others will say that we eat with our eyes. That’s why a rarity system
          distinguishing the dulcet taste from the more extravagant one was elaborated.
        </p>
        <p>
          Each waffle will be unique and programmatically generated from over 1xx singular and possible traits. All
          waffles are yummy but some will be rarer and tastier than others.
        </p>
        <div style={{overflow: 'auto'}}>
          <table style={{
            margin: 'auto',
            width: '650px',
            maxWidth: '100%',
          }}>
            <thead>
            <tr>
              <th>COMMON</th>
              <th>UNCOMMON</th>
              <th>RARE</th>
              <th>EPIC</th>
              <th>LEGENDARY</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Agreeable</td>
              <td>Flavorful</td>
              <td>Tasty</td>
              <td>Delightful</td>
              <td>Heavenly</td>
            </tr>
            <tr>
              <td>Pleasant</td>
              <td>Appetizing</td>
              <td>Yummy</td>
              <td>Mouthwatering</td>
              <td>Luscious</td>
            </tr>
            <tr>
              <td/>
              <td/>
              <td>Savory</td>
              <td>Delicious</td>
              <td>Ambrosial</td>
            </tr>
            <tr>
              <td/>
              <td/>
              <td/>
              <td>Delish</td>
              <td/>
            </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title={'Waffle Team'}
        contentStyle={{
          display: 'grid',
          maxWidth: '1500px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr) )',
          gap: '6rem',
          alignItems: 'baseline',
        }}
        id={'team'}
      >
        <MemberCard
          name={'WaffleDAO'}
          title={"our new CEO"}
          url={'https://twitter.com/WaffleSoClubNFT'}
        />
        <MemberCard
          url={"https://twitter.com/D3v0_WSC"}
          avatar={"/avatar_1.png"}
          title={'Waffle Maker'}
          role={'Co-founder & Technical Lead'}
          name={'D3v0'}
        />
        <MemberCard
          middle
          url={"https://twitter.com/yoloshiden"}
          avatar={"/avatar_2.png"}
          title={'Pastry Chef'}
          role={"Co-founder / Project Manager & NFT Connoisseur"}
          name={'Yolo'}
        />
        <MemberCard
          url={"https://twitter.com/morfessa"}
          avatar={"/avatar_3.png"}
          role={'DevOps & DAO Facilitator'}
          title={'Chocolatier'}
          name={'Semias'}
        />
        <MemberCard
          name={'Kahtael'}
          avatar={"/avatar_4.png"}
          title={'Ice Cream Maker'}
          role={"Marketing Officer & Jpeg Maximalist"}
        />
        <MemberCard
          middle
          name={'Agent'}
          avatar={"/avatar_5.png"}
          title={'Candy Confectioner'}
          role={'Developer & Hodler'}
        />

      </Section>

      <Section
        title={'FAQ'}
        id="faq"
        contentStyle={{
          display: 'grid',
          maxWidth: '1500px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr) )',
          gap: '2rem',
          alignItems: 'baseline',
        }}
      >
        <Details
          question={"How many Waffle will be minted?"}
          content={"The answer to your question should be here somewhere, keep looking..."}/>
        <Details
          question={"What can i dot with my waffle Club ?"}
          content={"The answer to your question should be here somewhere, keep looking..."}
        />
        <Details
          question={"When will it be revealed?"}
          content={"The answer to your question should be here somewhere, keep looking..."}
        />
        <Details
          question={"After minting?"}
          content={"The answer to your question should be here somewhere, keep looking..."}
        />
        <Details
          question={"When on the secondary market?"}
          content={"The answer to your question should be here somewhere, keep looking..."}
        />
        <Details
          question={"Can I see the contract adress ?"}
          content={"The answer to your question should be here somewhere, keep looking..."}
        />
        <Details
          question={"I got a DM with a link from someone claiming to be a team member, can I trust it?"}
          content={"The answer to your question should be here somewhere, keep looking..."}
        />
        <Details
          question={"What about the ownership of the NFTs ?"}
          content={"Please we invite you to read the terms and conditions page"}
        />
      </Section>
      <AliceCarousel
        animationDuration={15000}
        autoPlayInterval={1}
        animationEasingFunction={'linear'}
        autoPlay
        infinite
        disableDotsControls
        autoWidth
        disableButtonsControls
        mouseTracking
        items={artworks.map((src:string) => <Image key={src} src={src} width={300} height={300} alt={""}/>)}
      />
      <Footer/>
    </>
  );
}
