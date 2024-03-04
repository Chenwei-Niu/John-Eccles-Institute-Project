import {Component} from 'react'

export default class FooterComponent extends Component {
    state = {
      content:`
        <!-- noindex -->
        <div id="footer-wrap" role="contentinfo" class="gw2-footer">
            <div id="anu-footer">
            <div id="anu-detail">
                <ul>
                <li><a href="http://www.anu.edu.au/contact">Contact ANU</a></li>
                        <li><a href="http://www.anu.edu.au/copyright">Copyright</a></li>
                        <li><a href="http://www.anu.edu.au/disclaimer">Disclaimer</a></li>
                <li><a href="http://www.anu.edu.au/privacy">Privacy</a></li>
                <li><a href="http://www.anu.edu.au/freedom-of-information">Freedom of Information</a></li>
                </ul>
            </div>
            <div id="anu-address">
                <p>+61 2 6125 5111<br/>
                The Australian National University, Canberra<br/>
                TEQSA Provider ID: PRV12002 (Australian University)<br>
                CRICOS Provider : 00120C<br/>
                <span class="NotAPhoneNumber">ABN : 52 234 063 906</span></p>
            </div>
                
                    <div id="anu-groups">
                <div class="anu-ftr-go8 hpad vpad"><a href="http://www.anu.edu.au/about/partnerships/group-of-eight"><img class="text-white" src="https://marketing-pages.anu.edu.au/_anu/4/images/logos/2x_GroupOf8.png" alt="Group of Eight Member" /></a></div>
                <div class="anu-ftr-iaru hpad vpad"><a href="http://www.anu.edu.au/about/partnerships/international-alliance-of-research-universities"><img class="text-white" src="https://marketing-pages.anu.edu.au/_anu/4/images/logos/2x_iaru.png" alt="IARU" /></a></div>
                <div class="anu-ftr-apru hpad vpad"><a href="http://www.anu.edu.au/about/partnerships/association-of-pacific-rim-universities"><img class="text-white" src="https://marketing-pages.anu.edu.au/_anu/4/images/logos/2x_apru.png" alt="APRU" /></a></div>
                <div class="anu-ftr-edx hpad vpad"><a href="http://www.anu.edu.au/about/partnerships/edx"><img class="text-white" src="https://marketing-pages.anu.edu.au/_anu/4/images/logos/2x_edx.png" alt="edX" /></a></div>
        
            </div><div class="left ie7only full msg-warn" id="ie7-warn" >You appear to be using Internet Explorer 7, or have compatibility view turned on.  Your browser is not supported by ANU web styles.  <br>&raquo; <a href="http://webpublishing.anu.edu.au/steps/anu-web-environment/no_more_ie_7.php">Learn how to fix this</a>
                    
                    <br><span class="small" id="ignore-ie7-cookie">&raquo; <a href="http://webpublishing.anu.edu.au/steps/anu-web-environment/no_more_ie_7.php?ignore=1" >Ignore this warning in future</a></span>
                    </div>  </div>
        </div>
        <!-- endnoindex --> 
      `
    }
    render(){
      return (
        <div dangerouslySetInnerHTML={{__html: this.state.content}}></div>
      )
    }
  }