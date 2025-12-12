import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, Shield, Database, Globe, AlertTriangle, Code, GraduationCap, ExternalLink, Network } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
          
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6 text-white">
              About <span className="text-primary">SurveillanceWatch</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A comprehensive open-source database tracking surveillance technology vendors, 
              government contracts, and monitoring capabilities worldwide. We believe in transparency, 
              accountability, and the right to privacy in the digital age.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              SurveillanceWatch is dedicated to mapping the global surveillance industry. 
              Our goal is to provide accessible, accurate information about entities involved 
              in surveillance technology, helping researchers, journalists, and citizens understand 
              the landscape of digital monitoring.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We track companies, government agencies, and organizations that develop, deploy, 
              or facilitate surveillance technologies, including facial recognition, data analytics, 
              spyware, and other monitoring systems.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <Database className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-display">Comprehensive Database</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Detailed information about surveillance entities, their technologies, 
                and global operations.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <Globe className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-display">Global Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Interactive world map showing the geographic distribution of surveillance 
                technology entities.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-display">Open Source</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built with transparency in mind. All data and code are open source and 
                available for research.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <AlertTriangle className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-display">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Categorized risk levels help identify entities with the most significant 
                privacy and human rights implications.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <Code className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-display">API Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Programmatic access to our database for researchers and developers 
                building their own tools.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <Eye className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-display">Continuous Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Regular updates as new information becomes available about surveillance 
                technologies and their deployment.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Methodology */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="font-display">Methodology</CardTitle>
            <CardDescription>How we collect and verify information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Data Sources</h3>
              <p className="text-sm text-muted-foreground">
                Our database is compiled from publicly available sources including:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                <li>Government contracts and procurement databases</li>
                <li>Company websites and public filings</li>
                <li>News articles and investigative reports</li>
                <li>Academic research and publications</li>
                <li>Open-source intelligence (OSINT) sources</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Verification</h3>
              <p className="text-sm text-muted-foreground">
                All entries are cross-referenced with multiple sources before being added 
                to the database. We prioritize accuracy and transparency in our data collection.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Research & Partnerships */}
        <Card className="bg-card/50 border-border/50 border-primary/20">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" />
              Research & Partnerships
            </CardTitle>
            <CardDescription>Collaborative research networks and initiatives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                MIT Digital Currency Initiative (DCI) Global
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                SurveillanceWatch is aligned with research initiatives that focus on understanding how digital technologies 
                impact privacy, financial sovereignty, and human rights globally. The MIT DCI Global research network 
                represents an important parallel effort in understanding digital currency adoption and design.
              </p>
              
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-sm mb-2">Key Research Questions</h4>
                <ul className="text-xs text-muted-foreground space-y-2 ml-4">
                  <li className="list-disc">
                    <strong>Design & Usability:</strong> How can we design wallets and applications to be safer and easier to use?
                  </li>
                  <li className="list-disc">
                    <strong>Real-World Impact:</strong> Where do users encounter issues, and how can we address them across the full stack?
                  </li>
                  <li className="list-disc">
                    <strong>Adoption Barriers:</strong> What factors dissuade use—latency, complexity, trust, or fees?
                  </li>
                  <li className="list-disc">
                    <strong>Risks & Mitigation:</strong> How can design choices help mitigate risks like scams, volatility, exclusion, or concentration of power?
                  </li>
                  <li className="list-disc">
                    <strong>User Sovereignty:</strong> What technical design choices can "bake in" user sovereignty and prevent infringement on user rights?
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Global Focus</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Rapid adoption of digital technologies is happening in places like Lagos, Manila, and Buenos Aires. 
                    Understanding the real-world importance of properties like privacy and self-custody requires collaboration 
                    with people who intimately understand the problems with their financial and surveillance systems because 
                    they live and work in them every day.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">DCI Global Network</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                    DCI Global is a collaborative network of universities and non-profits working on digital currency education 
                    and research, with a focus on understanding how these technologies are being used, how to explain their risks, 
                    and how to improve them to solve real problems for real people.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>Open source course materials for Cryptocurrency Design and Engineering</li>
                    <li>Joint research projects with universities worldwide</li>
                    <li>Focus on Bitcoin and stablecoins with demonstrated real-world usage</li>
                    <li>Building technology capacity globally</li>
                  </ul>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <a 
                    href="https://www.dci.mit.edu/posts/new-research-network" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    Read the full announcement
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 pt-4">
              <h4 className="font-semibold text-sm mb-2">How to Get Involved</h4>
              <p className="text-xs text-muted-foreground mb-3">
                If you're interested in collaborative research on digital privacy, surveillance technology, or financial sovereignty:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Computer science lecturers interested in teaching related courses</li>
                <li>Students and researchers in related disciplines</li>
                <li>On-the-ground non-profit organizations working on privacy and digital rights</li>
                <li>Experts in financial inclusion and global collaboration</li>
                <li>Technologists working on inclusion from other perspectives</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contributing */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="font-display">Contributing</CardTitle>
            <CardDescription>Help us improve the database</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              SurveillanceWatch is a community-driven project. We welcome contributions including:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Submitting new entities or updating existing entries</li>
              <li>Reporting inaccuracies or outdated information</li>
              <li>Contributing code improvements</li>
              <li>Sharing research and documentation</li>
            </ul>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-card/50 border-border/50 border-destructive/20">
          <CardHeader>
            <CardTitle className="font-display text-destructive">Disclaimer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The information provided on SurveillanceWatch is for research and educational purposes only. 
              While we strive for accuracy, we cannot guarantee the completeness or correctness of all data. 
              Users should verify information independently before making any decisions based on this database.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

