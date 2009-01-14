require 'fileutils'
require 'erb'

JJ_ROOT = File.join(File.dirname(__FILE__), '..')
JJ_DIST = File.join(JJ_ROOT, 'dist', 'jj.js')
JJ_SRC  = File.join(JJ_ROOT, 'src')

def read_js(name)
  File.read(File.join(JJ_SRC, "#{name}.js"))
end

def read_template
  File.read(File.join(JJ_ROOT, 'lib', 'template.erb'))
end

def write_dist(content)
  FileUtils.mkdir_p(File.dirname(JJ_DIST))
  File.open(JJ_DIST, 'w') do |f|
    f << content
  end
end

class String
  def erb_eval(b)
    ERB.new(self).result(b)
  end
end