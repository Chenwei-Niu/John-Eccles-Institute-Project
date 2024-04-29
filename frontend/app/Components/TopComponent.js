import {Component} from 'react'

export default class TopComponent extends Component {
    state = {
      content:`
      <link rel="stylesheet" href="cecs.min.css">
      <link rel="stylesheet" href="JEI_seminar_main.css">

      <!-- noindex -->
      <div id="skipnavholder"><a id="skipnav" href="#content">Skip navigation</a></div>
      <div id="print-hdr">
        <div class="left"><img src="https://marketing-pages.anu.edu.au/_anu/4/images/logos/anu_logo_print.png" alt="The Australian National University" height="40" width="115" /></div>
          <div class="right"></div>
        <div class="blockline"></div>
      </div><div id="bnr-wrap" class="bnr-gwy-high" role="banner">
        <div id="bnr-gwy" class="bnr-gwy-high">
          <div id="bnr-left"><a href="http://www.anu.edu.au/" class="anu-logo-png"><img class="text-white" src="https://marketing-pages.anu.edu.au/_anu/4/images/logos/2x_anu_logo_small.svg" onmouseover="this.src='https://marketing-pages.anu.edu.au/_anu/4/images/logos/2x_anu_logo_small.svg';" onfocus="this.src='https://marketing-pages.anu.edu.au/_anu/4/images/logos/2x_anu_logo_small.svg';" onmouseout="this.src='https://marketing-pages.anu.edu.au/_anu/4/images/logos/2x_anu_logo_small.svg'" onblur="this.src='https://marketing-pages.anu.edu.au/_anu/4/images/logos/2x_anu_logo_small.svg'" alt="The Australian National University" /></a></div>
      <div id="bnr-mid"><div class="left"><img src="https://marketing-pages.anu.edu.au/_anu/4/images/logos/pipe_logo_small.png" alt="" width="66" height="51" class="anu-logo-pipe left" /></div><div class="left" id="bnr-h-lines">
                  <div class="bnr-line-1 bnr-collegeof lnk-cecs bnr-2line"><h1><a href="//cecs.anu.edu.au">
                      THE JOHN CURTIN SCHOOL OF MEDICAL RESEARCH</a></h1><div class="bnr-line-2"><a href="//cecs.anu.edu.au">The Eccles Institute of Neuroscience</a></div></div></div></div>
              <div id="bnr-right">
              
              <div class="bnr-gw2-search ">
              <form action="//find.anu.edu.au/search" method="get" id="SearchForm" role="search" autocomplete="off">
              <div>
              
             <label for="qt" class="scrnhide">Search query</label><input class="txt" name="q" id="qt" type="search" placeholder="Search ANU web, staff &amp; maps" autocomplete="off"><input type="hidden" class="srch-f srch-sel-gsa-hidden" name="as_f" data-name="as_f" value="domain_s[cecs.anu.edu.au]"><div class="srch-sel-site">
      <ul>
          <li class="srch-sel-anu srch-selected"><span>Search ANU web, staff &amp; maps</span><li class="srch-sel-currentsite" id="srch-sel-currentsite-bnr" data-anu-searchname="ANU%20College%20of%20Engineering%2C%20Computing%20and%20Cybernetics"><span>Search current site content</span>
      </ul>
      </div>
      <div class="srch-divide" id="srch-sel-cont"><div class="srch-updown">
      <img id="srch-sel-arrow" src="https://marketing-pages.anu.edu.au/_anu/4/images/buttons/arrow-down-black.png" alt="search scope"></div></div><div class="srch-divide"><div class="srch-divide2"></div></div>
      <button value="Go" name="search1" id="search1" onclick="return checkInput('qt','You must enter search terms');" class="btn-go"><span class="scrnhide">Search</span>
      <img src="https://marketing-pages.anu.edu.au/_anu/4/images/buttons/search-black.png" alt=""></button></div>
              </form>
              </div>
      
                  </div>
                  
                  <div id="bnr-low">
      
      
                  </div>
      </div>
      </div>
      <div id='dark-tab-wrap'></div>  <div id="tabs-wrap" role="navigation">
          <div id="gw-nav">
            <div id="gw-nav-links"><ul><li><a href="/" title="" class="tabs-home">Home</a></li><li><a href="https://jcsmr.anu.edu.au/research/divisions/eccles-institute-neuroscience/about" title="" id="gw-mega-tab-2" data-mega-menu-trigger="2">About</a></li><li><a href="https://jcsmr.anu.edu.au/research/divisions/eccles-institute-neuroscience/research-groups" title="" id="gw-mega-tab-3" data-mega-menu-trigger="3">Research Groups</a></li><li><a href="https://jcsmr.anu.edu.au/research/divisions/eccles-institute-neuroscience/people" title="" id="gw-mega-tab-4" data-mega-menu-trigger="4">People</a></li><li><a href="https://jcsmr.anu.edu.au/research/divisions/eccles-institute-neuroscience/news-events" title="" id="gw-mega-tab-5" data-mega-menu-trigger="5">News & Events</a></li><li><a href="https://jcsmr.anu.edu.au/research/divisions/eccles-institute-neuroscience/projects" title="">Projects</a></li><li><a href="https://jcsmr.anu.edu.au/research/divisions/eccles-institute-neuroscience/contacts" title="" id="gw-mega-tab-7" data-mega-menu-trigger="7">Contacts</a></li></ul></div>    </div>
        </div> <!-- /#tabs-wrap -->
        <div id="gw-mobile-menu-wrap" class="bnr-gwy-high" role="navigation">
          <div id="gw-mobile-menu-nav">
        <div class="search-menu">
          <ul>
            <li>
              <a href="#" class="mobile-menu-toggle">
                <img alt="" class="ittybittypadright" src="https://marketing-pages.anu.edu.au/_anu/4/images/buttons/menu-white.png">
                <span id="menuword">Menu</span>
              </a>
            </li>
            <li class="right">
              <a href="#" class="mobile-search-toggle">
                <span id="searchword"></span>
                <img alt="Search" src="https://marketing-pages.anu.edu.au/_anu/4/images/buttons/search-white.png">
              </a>
            </li>
          </ul>
        </div>
      </div><div id="gw-menuslidecover" class="left">
        <div id="mobilesearch" class="left bnr-gw2-search">
          <div class="text-right">
            <form action="//find.anu.edu.au/search" method="get" id="SearchForm1" role="search" autocomplete="off">
              <input type="hidden" name="filter" value="0">
              <input type="hidden" name="client" value="anu_frontend">
              <input type="hidden" name="proxystylesheet" value="anu_frontend">
              <input type="hidden" name="site" value="default_collection">
              <input type="hidden" name="btnG" value="Search">
              <label for="qt1"><span class="nodisplay">Search query</span></label>
              <input class="txt" name="q" id="qt1" autocomplete="off" type="search" placeholder="Search ANU web, staff &amp; maps">
                        <div class="srch-divide" id="srch-sel-cont1">
                  <div class="srch-updown">
                    <img id="srch-sel-arrow1" src="https://marketing-pages.anu.edu.au/_anu/4/images/buttons/arrow-down-black.png" alt="search scope">
                  </div>
                </div>
                <!-- <input type="hidden" class="srch-dn" name="c-dnavs" value="inmeta:gsaentity_sitetype=cecs.anu.edu.au">
                <input type="hidden" class="srch-q" name="c-q" value="inmeta:gsaentity_sitetype=cecs.anu.edu.au"> -->
                      <div class="srch-divide">
                <div class="srch-divide2"></div>
              </div>
              <label for="search1a"><span class="nodisplay">Search</span></label>
              <input type="submit" value="Go" name="search1a" id="search1a" class="btn-go">
            </form>
          </div>
        </div>
      </div>
        <div class="srch-sel-site">
          <ul>
            <li class="srch-sel-anu srch-selected">
              <span>Search ANU web, staff &amp; maps</span>
            </li>
            <li class="srch-sel-currentsite" data-anu-searchname="cecs.anu.edu.au">
              <span>Search current site content</span>
            </li>
          </ul>
        </div>
        </div>
      
      
      
      <!-- endnoindex -->
      <div id="body-wrap" class="clearfix" role="main">
        <div id="body">
      
      
      
      
      
      <div id="content-main" class="margintop clearfix">
      
      
      
        <div id="content-area" class="region region-content clear">
          <div id="block-system-main" class="block block-system">
        
        <div class="">
                                
          <div class="content block-content clearfix">
            <div class="panel-display acton-grid-layout anu-band-layout nopadtop clearfix">
                <div class="band-white-wrap clearfix">
            <div>
              <div class="panel-pane pane-views-panes pane-2018-banner-band-home-panel-pane-default"  >
        
            
        
        <div class="pane-content">
          <div class="view view-2018-banner-band-home view-id-2018_banner_band_home view-display-id-panel_pane__default view-dom-id-ea268c056be94b6b28703c3d59f75de4">
              
        
        
        
            <div class="view-content">
                <div class="first last odd">
            
            <div>
        
          
            <div class="band-banner-wrap clearfix">
        <div class="band-banner-cover" ><a href=""><img typeof="foaf:Image" style="height:500px" src="John_Eccles.jpg" width="2000" height="500" alt="" /></a></div>
        <div class="band-banner">
          <div class="band-banner-text">
            <h1>The Eccles Institute of Neuroscience</h1>
                              <p><p>
                  The Eccles Institute of Neuroscience (EIN), established in 2012 at ANU's John Curtin School of Medical Research, is a cutting-edge research facility focusing on cellular and synaptic physiology, sensory physiology, retina-related studies, and muscle research. Led by Professor John Bekkers, it provides a conducive environment for neuroscience research with a cellular focus and emphasis on sensory systems.</p>
      </p>
            <div><br />
              <a class="band-banner-btn" href="https://jcsmr.anu.edu.au/research/divisions/eccles-institute-neuroscience/about">Read more</a><br />
      &nbsp;
              </div>
          </div>
        </div>
      </div>
            </div>
        
          </div>
            </div>
        
        
        
        
        
        
      </div>  </div>
      
        
        </div>
            </div>
          </div>
          </div></div></div></div></div></div></div></div>
          
                  <div class="band-college-wrap clearfix">
            <div class="band-college">
              <div class="panel-pane pane-custom pane-12 text-center padtop"  >
        
            
        
        <div class="pane-content">
          <h4 style="font-size: 1.5em"><strong>Welcome to the Eccles Institute of Neuroscience</strong></h4>
      </div>
      
        
        </div>
            </div>
          </div>
      <!-- my component starts -->
      `
    }
    render(){
      return (
        <div dangerouslySetInnerHTML={{__html: this.state.content}} className='html front not-logged-in no-sidebars page-home anu-band domain-cecs acton section-home'></div>
      )
    }
  }